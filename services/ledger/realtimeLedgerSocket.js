// services/ledger/realtimeLedgerSocket.js

const { ledgerEventHub } = require('./eventStreamHub');

/**
 * REAL-TIME LEDGER WEBSOCKET BRIDGE
 */
function initLedgerSocket(io) {

  ledgerEventHub.subscribe((event) => {

    io.emit('ledger:event', {
      id: event.id,
      aggregateId: event.aggregateId,
      eventType: event.eventType,
      reference: event.reference,
      payload: event.payload,
      createdAt: event.createdAt
    });

  });

}

module.exports = {
  initLedgerSocket
};