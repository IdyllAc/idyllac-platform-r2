// services/ledger/projectionWorker.js
const { LedgerEventStream } = require('../../models');
const { dispatchLedgerEvent } = require('./eventDispatcher');

async function processPendingEvents({
  sequelize,
  batchSize = 100
}) {

  const pendingEvents =
    await LedgerEventStream.findAll({

      where: {
        projectionStatus: 'PENDING'
      },

      order: [
        ['id', 'ASC']
      ],

      limit: batchSize
    });

  let processed = 0;

  for (const event of pendingEvents) {

    try {

        // SAFETY GUARD (THIS IS THE RIGHT PLACE)
      if (event.projectionStatus === 'PROJECTED') continue;

      await dispatchLedgerEvent({
        sequelize,
        event
      });

      await event.update({
        projectionStatus: 'PROJECTED',
        projectedAt: new Date()
      });

      processed++;

    } catch (err) {

      console.error(
        'PROJECTION FAILED:',
        event.id,
        err
      );

      await event.update({

        projectionStatus: 'FAILED'

      });

    }

  }

  return {

    processed,
    total: pendingEvents.length

  };

}

module.exports = {

  processPendingEvents

};