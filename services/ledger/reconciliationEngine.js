// services/ledger

const { LedgerEventStream, LedgerEntry, Transfer } = require('../../models');
const { Op } = require('sequelize');

/**
 * GLOBAL RECONCILIATION ENGINE (SAFE MODE)
 *
 * PURPOSE:
 * - Detect mismatches between events and projections
 * - Verify ledger completeness
 * - Ensure financial consistency
 *
 * ⚠️ DOES NOT MODIFY DATA (AUDIT ONLY)
 */
async function runLedgerReconciliation({
  aggregateId = null
}) {

  // =========================
  // 1. LOAD EVENTS
  // =========================
  const eventWhere = {};

  if (aggregateId) {
    eventWhere.aggregateId = aggregateId;
  }

  const events = await LedgerEventStream.findAll({
    where: eventWhere,
    order: [['id', 'ASC']]
  });

  // =========================
  // 2. LOAD LEDGER ENTRIES
  // =========================
  const entryWhere = {};

  if (aggregateId) {
    entryWhere.transferId = aggregateId;
  }

  const entries = await LedgerEntry.findAll({
    where: entryWhere
  });

  // =========================
  // 3. LOAD TRANSFERS
  // =========================
  const transfers = await Transfer.findAll({
    where: aggregateId ? { id: aggregateId } : {},
    order: [['id', 'ASC']]
  });

  // =========================
  // 4. BUILD INDEXES
  // =========================
  const entryMap = new Map();

  for (const e of entries) {
    const key = e.transferId;

    if (!entryMap.has(key)) {
      entryMap.set(key, []);
    }

    entryMap.get(key).push(e);
  }

  const eventMap = new Map();

  for (const ev of events) {
    const key = ev.aggregateId;

    if (!eventMap.has(key)) {
      eventMap.set(key, []);
    }

    eventMap.get(key).push(ev);
  }

  // =========================
  // 5. ANALYSIS RESULTS
  // =========================
  const report = {
    summary: {
      totalEvents: events.length,
      totalLedgerEntries: entries.length,
      totalTransfers: transfers.length
    },
    issues: [],
    transfers: []
  };

  // =========================
  // 6. TRANSFER-BY-TRANSFER ANALYSIS
  // =========================
  for (const transfer of transfers) {

    const tId = transfer.id;

    const transferEvents = eventMap.get(tId) || [];
    const transferEntries = entryMap.get(tId) || [];

    // RULE 1 — missing ledger entries
    if (transferEvents.length > 0 && transferEntries.length === 0) {
      report.issues.push({
        type: 'MISSING_LEDGER_ENTRIES',
        transferId: tId,
        eventCount: transferEvents.length
      });
    }

    // RULE 2 — missing events
    if (transferEntries.length > 0 && transferEvents.length === 0) {
      report.issues.push({
        type: 'ORPHAN_LEDGER_ENTRIES',
        transferId: tId,
        entryCount: transferEntries.length
      });
    }

    // RULE 3 — balance check
    let debit = 0;
    let credit = 0;

    for (const e of transferEntries) {
      const amount = parseFloat(e.amount);

      if (e.type === 'DEBIT') debit += amount;
      if (e.type === 'CREDIT') credit += amount;
    }

    if (Math.abs(debit - credit) > 0.0001) {
      report.issues.push({
        type: 'IMBALANCED_LEDGER',
        transferId: tId,
        debit,
        credit
      });
    }

    // STORE PER-TRANSFER RESULT
    report.transfers.push({
      transferId: tId,
      status: transfer.status,
      eventCount: transferEvents.length,
      entryCount: transferEntries.length,
      balanced: Math.abs(debit - credit) < 0.0001
    });
  }

  // =========================
  // 7. FINAL RESULT
  // =========================
  return {
    success: report.issues.length === 0,
    report
  };
}

module.exports = {
  runLedgerReconciliation
};