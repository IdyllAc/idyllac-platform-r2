// services/ledger/eventStreamHub.js

const EventEmitter = require('events');

/**
 * GLOBAL LEDGER EVENT STREAM
 * Acts as in-memory event bus
 */
class LedgerEventHub extends EventEmitter {

  emitEvent(event) {
    this.emit('ledger.event', event);
  }

  subscribe(handler) {
    this.on('ledger.event', handler);
  }
}

const ledgerEventHub = new LedgerEventHub();

module.exports = {
  ledgerEventHub
};