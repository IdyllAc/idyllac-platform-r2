// // test-event.js

// const { sequelize } = require('./models');

// const {
//   appendLedgerEvent
// } = require('./services/ledger/eventAppender');

// (async () => {

//   await appendLedgerEvent({

//     aggregateId: 999,

//     eventType: 'TRANSFER_SETTLED',

//     reference: 'TEST-SETTLEMENT',

//     userId: 1,

//     payload: {
//       debitAccount: 1,
//       creditAccount: 2,
//       amount: 100,
//       currency: 'USD'
//     },

//     idempotencyKey:
//       `test-${Date.now()}`
//   });

//   process.exit(0);

// })();