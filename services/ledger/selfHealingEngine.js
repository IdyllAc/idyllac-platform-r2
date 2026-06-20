// services/ledger/selfHealingEngine.js

const { LedgerEventStream } = require('../../models');
const { projectLedgerEvent } = require('./projectionEngine');
const { Op } = require('sequelize');

/**
 * SELF-HEALING LEDGER ENGINE
 *
 * PURPOSE:
 * - Detect broken or missing projections
 * - Replay only what is needed
 * - Fix FAILED / PENDING events
 *
 * SAFE MODE:
 * - No business logic changes
 * - Only projection rebuild
 */
async function runSelfHealing({
  sequelize,
  aggregateId = null,
  batchSize = 100
}) {

  const where = {
    projectionStatus: {
      [Op.in]: ['PENDING', 'FAILED']
    }
  };

  if (aggregateId) {
    where.aggregateId = aggregateId;
  }

  console.log(
    '[SELF HEAL] START'
  ); 

  const events = await LedgerEventStream.findAll({
    where,
    order: [['id', 'ASC']]
  });

  console.log(
    '[SELF HEAL] EVENTS FOUND:',
    events.length
  );

  const result = {
    total: events.length,
    fixed: 0,
    skipped: 0,
    failures: []
  };

  for (const event of events) {

    const t = await sequelize.transaction();

    try {

      // =========================
      // IDEMPOTENCY GUARD
      // =========================
      if (event.projectionStatus === 'PROJECTED') {
        result.skipped++;
        await t.commit();
        continue;
      }

      // =========================
      // REPLAY / FIX PROJECTION
      // =========================
      console.log(
        '[SELF HEAL] PROJECTING:',
        event.id,
        event.eventType
      );
      
      await projectLedgerEvent({
        sequelize,
        transaction: t,
        event
      });
      
      console.log(
        '[SELF HEAL] PROJECTED:',
        event.id
      );

      // =========================
      // MARK AS FIXED
      // =========================
      await event.update({
        projectionStatus: 'PROJECTED',
        projectedAt: new Date()
      }, { transaction: t });

      await t.commit();

      result.fixed++;

    } catch (err) {

      await t.rollback();

      await event.update({
        projectionStatus: 'FAILED'
      });

      result.failures.push({
        eventId: event.id,
        error: err.message
      });
    }
  }

  return {
    success: result.failures.length === 0,
    result
  };
}

module.exports = {
  runSelfHealing
};