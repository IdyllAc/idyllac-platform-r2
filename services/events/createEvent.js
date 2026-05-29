// services/events/createEvent.js
const { Transaction } = require('sequelize');
const { EventStore } = require('../../models');

async function createEvent({

  t,
  aggregateId,
  aggregateType = 'TRANSFER',
  eventType,
  payload = {},
  metadata = {}

}) {

  const options = t ? { transaction: t } : {};

  return await EventStore.create({

    aggregateId: aggregateId,
    eventType,
    payload,
    metadata

  }, {
    Transaction: t
  });

}

module.exports = createEvent;