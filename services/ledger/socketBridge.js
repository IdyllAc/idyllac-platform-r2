// services/ledger/socketBridge.js

const { ledgerEventHub } =
  require('./eventStreamHub');

function startLedgerSocketBridge(io) {

  ledgerEventHub.on('ledger.event', (event) => {

      io.emit(
        'ledger:event',
        event
      );

      console.log(
        '[SOCKET]',
        event.eventType,
        event.reference
      );
    }
  );
}

module.exports = {
  startLedgerSocketBridge
};