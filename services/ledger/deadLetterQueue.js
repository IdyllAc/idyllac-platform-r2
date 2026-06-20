// services/ledger/deadLetterQueue.js

const { LedgerEventStream } = require('../../models');

/**
 * DEAD LETTER QUEUE
 * Stores permanently failed events for analysis/retry
 */
async function pushToDLQ({
  event,
  errorMessage
}) {

  await LedgerEventStream.update({
    projectionStatus: 'FAILED',
    errorMessage
  }, {
    where: { id: event.id }
  });
}

/**
 * RETRY FAILED EVENTS ONLY
 */
async function retryFailedEvents({
  sequelize
}) {

  const events = await LedgerEventStream.findAll({
    where: {
      projectionStatus: 'FAILED'
    }
  });

  let retried = 0;

  for (const event of events) {

    try {

      const t = await sequelize.transaction();

      await event.update({
        projectionStatus: 'PENDING'
      }, { transaction: t });

      await t.commit();

      retried++;

    } catch (err) {
      console.error('DLQ retry failed:', event.id, err.message);
    }
  }

  return { retried };
}

module.exports = {
  pushToDLQ,
  retryFailedEvents
};