// services/ledger/eventAppender.js

const { LedgerEventStream } = require('../../models');
const { ledgerEventHub } = require('./eventStreamHub');

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

  if (!idempotencyKey) {
    throw new Error("Missing idempotencyKey for ledger event");
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