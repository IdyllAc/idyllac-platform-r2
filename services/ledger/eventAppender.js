// services/ledger/eventAppender.js

const { LedgerEventStream } = require('../../models');
const { ledgerEventHub } = require('./eventStreamHub');

const { dispatchLedgerEvent } = require('./eventDispatcher');
const { sequelize } = require('../../models');

// ONLY WRITE SIDE FUNCTION
async function appendLedgerEvent({
  transaction,
  aggregateId,
  aggregateType = 'TRANSFER',
  eventType,
  reference,
  userId,
  payload = {},
  idempotencyKey,
  source = 'API',
  version = 1
}) {

  // 🚨 HARD GUARANTEE: NO IDEMPOTENCY KEY = NO EVENT
  if (!idempotencyKey) {
    throw new Error('Missing idempotencyKey for ledger event');
  }

  // =========================
  // IDEMPOTENCY GUARD
  // =========================
  if (idempotencyKey) {
    const existing = await LedgerEventStream.findOne({
      where: { idempotencyKey },
      transaction
    });

    if (existing) {
      return { 
        skipped: true, 
        event: existing 
      };
    }
  }


  // =========================
  // CREATE EVENT (IMMUTABLE)
  // =========================
  const event = await LedgerEventStream.create(
    {
    aggregateId,
    aggregateType,
    eventType,
    reference,
    userId,
    payload,
    idempotencyKey,
    source,
    version
  }, 
  {
    transaction
  });

  // =========================
  // REAL-TIME STREAM EMIT
  // =========================
  ledgerEventHub.emit(
    'ledger.event',
    event.toJSON()
    );

  // =========================
  // AUTO PROJECTION
  // =========================

  try {

  await dispatchLedgerEvent({
    sequelize,
    event
  });


  console.log(
    '[AUTO PROJECTION SUCCESS]',
    event.id
  );

  
  // // MARK EVENT PROJECTED
  // await event.update(
  //   {
  //     projectionStatus: 'PROJECTED',
  //     projectedAt: new Date()
  //   },
  //   {
  //    transaction
  //   }
  // );


  } catch (err) {

  console.error(
    'AUTO PROJECTION FAILED:',
    err.message
  );

  await event.update(
    {
      projectionStatus: 'FAILED'
    },
    {
      transaction
      }
   );
 }


    console.log(
      '[EVENT EMITTED]',
      event.eventType
    );


  return {
    skipped: false,
    event
  };
}


module.exports = {
  appendLedgerEvent
};