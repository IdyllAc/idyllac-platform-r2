// services/outbox/createEvent.js

const { OutboxEvent } = require('../../models');

async function createEvent({
  t,
  eventType,
  aggregateId,
  payload
}) {

  return await OutboxEvent.create({
    eventType,
    aggregateId,
    payload
  }, { transaction: t });

}

module.exports = createEvent;