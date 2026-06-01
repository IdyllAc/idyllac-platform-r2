// services/ledger/projectionEngine.js
const { LedgerEntry } = require('../../models');

/**
 * Converts ledger events → deterministic double-entry ledger rows
 */
async function projectLedgerEvent({
  sequelize,
  transaction,
  event,
  accounts
}) {

  const { eventType, payload } = event;

  // =========================
  // TRANSFER SETTLED
  // =========================
  if (eventType === 'TRANSFER_SETTLED') {

    const { debitAccount, creditAccount, amount, currency } = payload;

    await LedgerEntry.create({
      ledgerAccountId: debitAccount,
      type: 'DEBIT',
      amount,
      currency,
      reference: event.reference,
      transferId: event.aggregateId,
      description: 'Projection: SETTLED'
    }, { transaction });

    await LedgerEntry.create({
      ledgerAccountId: creditAccount,
      type: 'CREDIT',
      amount,
      currency,
      reference: event.reference,
      transferId: event.aggregateId,
      description: 'Projection: SETTLED'
    }, { transaction });
  }

  // =========================
  // TRANSFER REVERSED
  // =========================
  if (eventType === 'TRANSFER_REVERSED') {

    const { debitAccount, creditAccount, amount, currency } = payload;

    await LedgerEntry.create({
      ledgerAccountId: debitAccount,
      type: 'DEBIT',
      amount,
      currency,
      reference: event.reference,
      transferId: event.aggregateId,
      description: 'Projection: REVERSED'
    }, { transaction });

    await LedgerEntry.create({
      ledgerAccountId: creditAccount,
      type: 'CREDIT',
      amount,
      currency,
      reference: event.reference,
      transferId: event.aggregateId,
      description: 'Projection: REVERSED'
    }, { transaction });
  }

  return true;
}

module.exports = {
  projectLedgerEvent
};