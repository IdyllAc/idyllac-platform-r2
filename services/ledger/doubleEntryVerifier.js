// services/ledger/doubleEntryVerifier.js

const { LedgerEntry } = require('../../models');

async function verifyDoubleEntry({ transferId = null }) {

  const where = transferId ? { transferId } : {};

  const entries = await LedgerEntry.findAll({ where });

  const result = {
    valid: true,
    transfers: {}
  };

  for (const e of entries) {

    const id = e.transferId;

    if (!result.transfers[id]) {
      result.transfers[id] = {
        debit: 0,
        credit: 0
      };
    }

    const amount = Number(e.amount);

    if (e.type === 'DEBIT') {
      result.transfers[id].debit += amount;
    }

    if (e.type === 'CREDIT') {
      result.transfers[id].credit += amount;
    }
  }

  const failures = [];

  for (const id in result.transfers) {

    const t = result.transfers[id];

    if (Math.abs(t.debit - t.credit) > 0.0001) {

      failures.push({
        transferId: id,
        debit: t.debit,
        credit: t.credit
      });
    }
  }

  return {
    success: failures.length === 0,
    failures
  };
}

module.exports = {
  verifyDoubleEntry
};








// // services/ledger/doubleEntryVerifier.js
// const { LedgerEntry } = require('../../models');

// async function verifyDoubleEntry({
//   transferId = null
// }) {

//   const where = {};

//   if (transferId) {
//     where.transferId = transferId;
//   }

//   const entries = await LedgerEntry.findAll({
//     where,
//     order: [['transferId', 'ASC']]
//   });

//   const groups = {};

//   for (const entry of entries) {

//     const key = entry.transferId;

//     if (!groups[key]) {
//       groups[key] = {
//         debits: 0,
//         credits: 0,
//         entries: []
//       };
//     }

//     groups[key].entries.push(entry);

//     const amount = Number(entry.amount);

//     if (entry.type === 'DEBIT') {
//       groups[key].debits += amount;
//     }

//     if (entry.type === 'CREDIT') {
//       groups[key].credits += amount;
//     }
//   }

//   const failures = [];

//   for (const transferId in groups) {

//     const group = groups[transferId];

//     if (group.debits !== group.credits) {

//       failures.push({
//         transferId,
//         debits: group.debits,
//         credits: group.credits,
//         difference:
//           group.debits - group.credits
//       });
//     }
//   }

//   return {
//     success: failures.length === 0,
//     checkedTransfers:
//       Object.keys(groups).length,
//     failures
//   };
// }

// module.exports = {
//   verifyDoubleEntry
// };