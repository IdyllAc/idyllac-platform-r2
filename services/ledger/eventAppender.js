const { LedgerEventStream } = require('../../models');

// ONLY WRITE SIDE FUNCTION
async function appendLedgerEvent({
  transaction,
  aggregateId,
  aggregateType = 'TRANSFER',
  eventType,
  reference,
  userId,
  payload = {},
  idempotencyKey = null,
  source = 'API',
  version = 1
}) {

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
  const event = await LedgerEventStream.create({
    aggregateId,
    aggregateType,
    eventType,
    reference,
    userId,
    payload,
    idempotencyKey,
    source,
    version
  }, {
    transaction
  });

  return {
    skipped: false,
    event
  };
}

module.exports = {
  appendLedgerEvent
};