// services/outbox/outboxEvent.js
const { OutboxEvent } = require('../../models');

async function createOutboxEvent({
  transaction,
  eventType,
  aggregateId,
  payload
}) {

  const event = await OutboxEvent.create({
    eventType,
    aggregateId,
    payload
  }, {
    transaction
  });

  return event;

}

module.exports = {
  createOutboxEvent
};
