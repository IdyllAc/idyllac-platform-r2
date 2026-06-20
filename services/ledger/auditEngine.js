// services/ledger/auditEngine.js
const { LedgerEntry } = require('../../models');

/**
 * AUDIT SYSTEM: detects inconsistencies
 */
async function runLedgerAudit() {

  const entries = await LedgerEntry.findAll();

  const issues = [];

  const grouped = {};

  // group by transferId
  for (const e of entries) {

    if (!grouped[e.transferId]) {
      grouped[e.transferId] = {
        debit: 0,
        credit: 0
      };
    }

    const amount = Number(e.amount);

    if (e.type === 'DEBIT') grouped[e.transferId].debit += amount;
    if (e.type === 'CREDIT') grouped[e.transferId].credit += amount;
  }

  for (const transferId in grouped) {

    const g = grouped[transferId];

    if (Math.abs(g.debit - g.credit) > 0.0001) {

      issues.push({
        transferId,
        debit: g.debit,
        credit: g.credit,
        diff: g.debit - g.credit
      });
    }
  }

  return {
    ok: issues.length === 0,
    issuesCount: issues.length,
    issues
  };
}

module.exports = {
  runLedgerAudit
};







// // services/ledger/auditEngine.js
// const { LedgerEventStream, LedgerEntry } = require('../../models');
// const { Op } = require('sequelize');

// /**
//  * AUDIT ENGINE:
//  * Detects mismatch between event stream and projections
//  */
// async function runLedgerAudit({
//   aggregateId = null
// }) {

//   const where = {};

//   if (aggregateId) {
//     where.aggregateId = aggregateId;
//   }

//   // =========================
//   // 1. LOAD EVENTS
//   // =========================
//   const events = await LedgerEventStream.findAll({
//     where,
//     order: [['id', 'ASC']]
//   });

//   // =========================
//   // 2. LOAD LEDGER ENTRIES
//   // =========================
//   const entries = await LedgerEntry.findAll({
//     where: aggregateId
//       ? { transferId: aggregateId }
//       : {},
//     order: [['id', 'ASC']]
//   });

//   // =========================
//   // 3. INDEX FOR FAST LOOKUP
//   // =========================
//   const entryMap = new Map();

//   for (const e of entries) {
//     const key = `${e.transferId}-${e.reference}-${e.type}`;
//     entryMap.set(key, e);
//   }

//   // =========================
//   // 4. MISMATCH DETECTION
//   // =========================
//   const issues = [];

//   for (const event of events) {

//     if (
//       event.eventType === 'TRANSFER_SETTLED' ||
//       event.eventType === 'TRANSFER_REVERSED'
//     ) {

//       const expectedKeys = buildExpectedLedgerKeys(event);

//       for (const key of expectedKeys) {

//         if (!entryMap.has(key)) {
//           issues.push({
//             type: 'MISSING_LEDGER_ENTRY',
//             eventId: event.id,
//             eventType: event.eventType,
//             missingKey: key
//           });
//         }
//       }
//     }
//   }

//   // =========================
//   // 5. ORPHAN LEDGER CHECK
//   // =========================
//   for (const entry of entries) {

//     const matchingEvent = events.find(
//       e => e.reference === entry.reference
//     );

//     if (!matchingEvent) {
//       issues.push({
//         type: 'ORPHAN_LEDGER_ENTRY',
//         entryId: entry.id,
//         reference: entry.reference
//       });
//     }
//   }

//   // =========================
//   // 6. RESULT SUMMARY
//   // =========================
//   return {
//     success: issues.length === 0,
//     totalEvents: events.length,
//     totalEntries: entries.length,
//     issues
//   };
// }

// /**
//  * Build expected ledger entries from event
//  */
// function buildExpectedLedgerKeys(event) {

//   const { eventType, payload } = event;

//   if (
//     eventType === 'TRANSFER_SETTLED' ||
//     eventType === 'TRANSFER_REVERSED'
//   ) {

//     return [
//       `${payload.transferId || event.aggregateId}-${event.reference}-DEBIT`,
//       `${payload.transferId || event.aggregateId}-${event.reference}-CREDIT`
//     ];
//   }

//   return [];
// }

// module.exports = {
//   runLedgerAudit
// };