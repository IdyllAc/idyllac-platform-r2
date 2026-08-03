// services/ledger/replayEngine.js

const { LedgerEventStream, LedgerEntry } = require('../../models');
const { projectLedgerEvent } = require('./projectionEngine');
const { rebuildLedgerBalances } = require('./balanceProjection');
const { Op } = require('sequelize');

const {
  createReplayJob,
  completeJob,
  failJob
} = require('./replayJobController');

async function replayLedgerEvents({
  sequelize,
  aggregateId = null,
  batchSize = 50
}) {

  // =========================
  // 1. CREATE / LOCK JOB
  // =========================
  const job = await createReplayJob({
    sequelize,
    aggregateId
  });

  try {

    let processed = 0;
    let lastId = 0;

    // =========================
    // 2. BATCH LOOP (CRASH SAFE)
    // =========================
    while (true) {

      const where = {
        id: { [Op.gt]: lastId },
        projectionStatus: {
          [Op.in]: ['PENDING', 'FAILED']
        }
      };

      if (aggregateId) {
        where.aggregateId = aggregateId;
      }

      const events = await LedgerEventStream.findAll({
        where,
        order: [['id', 'ASC']],
        limit: batchSize
      });

      if (events.length === 0) break;

      for (const event of events) {

        // skip already projected (no transaction needed)
        if (event.projectionStatus === 'PROJECTED') {
          lastId = event.id;
          continue;
        }

        const t = await sequelize.transaction();

        try {

          // await event.update({
          //   projectionLocked: true,
          //   processingSource: 'REPLAY'
          // }, { transaction: t });
        

          // =========================
          // PROJECT EVENT
          // =========================
          await projectLedgerEvent({
            sequelize,
            transaction: t,
            event
          });

          // =========================
          // MARK PROJECTED
          // =========================
          await event.update({
            projectionStatus: 'PROJECTED',
            projectedAt: new Date()
          }, { transaction: t });

          await t.commit();

          processed++;
          lastId = event.id;

          // =========================
          // JOB PROGRESS UPDATE
          // =========================
          if (processed % 10 === 0) {
            await job.update({
              processedEvents: processed,
              cursorId: lastId
            });
          }

        } catch (err) {

          await t.rollback();

          // IMPORTANT: no transaction update here
          await event.update({
            projectionStatus: 'FAILED'
          });

          console.error('REPLAY FAILED:', event.id, err.message);
        }
      }

      // small pause (protect DB)
      await new Promise(r => setTimeout(r, 50));
    }

    // =========================
    // 3. COMPLETE JOB
    // =========================
    await completeJob(job);

    return {
      success: true,
      processed,
      lastId
    };

  } catch (err) {

    await failJob(job, err);

    throw err;
  }
}



/**
 * FULL PROJECTION REBUILD (PRODUCTION SAFE)
 *
 * WARNING:
 * This wipes ALL projections and rebuilds from event log.
 */
async function rebuildProjectionsFromScratch({
  sequelize,
  aggregateId = null
}) {



  // =========================
  // 1. CREATE REPLAY JOB
  // =========================
  const job = await createReplayJob({
    sequelize,
    aggregateId
  });

  try {

    // =========================
    // 2. TRUNCATE PROJECTIONS SAFELY
    // =========================
    await sequelize.query(
      `TRUNCATE TABLE ledger_entries RESTART IDENTITY CASCADE`
    );

    // reset event projection status
    await sequelize.query(`
      UPDATE ledger_event_stream
      SET "projectionStatus" = 'PENDING',
          "projectedAt" = NULL
      WHERE 1=1
    `);

    // =========================
    // 3. CALL NORMAL REPLAY ENGINE
    // =========================
    const result = await replayLedgerEvents({
      sequelize,
      aggregateId
    });



    
    await rebuildLedgerBalances();



    // =========================
    // 4. COMPLETE JOB
    // =========================
    await completeJob(job);

    return {
      success: true,
      mode: 'FULL_REBUILD',
      result
    };

  } catch (err) {

    await failJob(job, err);

    throw err;
  }
}


module.exports = {
  replayLedgerEvents,
  rebuildProjectionsFromScratch
};