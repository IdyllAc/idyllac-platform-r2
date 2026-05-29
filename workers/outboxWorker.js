// workers/outboxWorker.js

const { sequelize } = require('../models');
const { processTransfer } = require('../services/ledger/processTransfer');

const MAX_RETRIES = 7;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getBackoffDelay(retryCount) {
  return Math.min(1000 * Math.pow(2, retryCount), 60000);
}

async function runWorker() {
  console.log('🚀 Outbox Worker V5.7 started...');

  while (true) {
    try {

      // =========================
      // ATOMIC CLAIM (NO RACE CONDITIONS)
      // =========================

      const [events] = await sequelize.query(`
        UPDATE outbox_events
        SET status = 'PROCESSING',
            "updatedAt" = NOW()
        WHERE id IN (
          SELECT id FROM outbox_events
          WHERE status = 'PENDING'
          ORDER BY "createdAt"
          LIMIT 10
          FOR UPDATE SKIP LOCKED
        )
        RETURNING *;
      `);

      if (!events.length) {
        await sleep(1000);
        continue;
      }

      // =========================
      // PROCESS EVENTS
      // =========================

      for (const event of events) {
        try {

          if (event.eventType === 'TRANSFER_CREATED') {
            await processTransfer(event);
          }

          await sequelize.query(`
            UPDATE outbox_events
            SET status = 'COMPLETED',
                "updatedAt" = NOW()
            WHERE id = :id
          `, {
            replacements: { id: event.id }
          });

        } catch (err) {
          console.error('Event failed:', err);

          const retryCount = (event.retryCount || 0) + 1;

          if (retryCount >= MAX_RETRIES) {
            await sequelize.query(`
              UPDATE outbox_events
              SET status = 'DEAD_LETTER',
                  retryCount = :retryCount
              WHERE id = :id
            `, {
              replacements: {
                id: event.id,
                retryCount
              }
            });

            continue;
          }

          await sequelize.query(`
            UPDATE outbox_events
            SET status = 'PENDING',
                retryCount = :retryCount
            WHERE id = :id
          `, {
            replacements: {
              id: event.id,
              retryCount
            }
          });

          await sleep(getBackoffDelay(retryCount));
        }
      }

    } catch (err) {
      console.error('Worker loop error:', err);
      await sleep(2000);
    }
  }
}

runWorker();
