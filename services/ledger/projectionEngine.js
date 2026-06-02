// services/ledger/projectionEngine.js
const { LedgerEntry } = require('../../models');

/**
 * CQRS Projection Layer
 *
 * IMPORTANT:
 * This file must NEVER:
 * - update Transfer
 * - update BankAccount
 * - create business decisions
 *
 * It may ONLY build projections/read models.
 */

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

  // // =========================
  // // TRANSFER CREATED
  // // =========================
  // if (eventType === 'TRANSFER_CREATED') {

  //   const { debitAccount, creditAccount, amount, currency } = payload;
  //   // audit only (NO ledger movement)
  // }


  // // =========================
  // // TRANSFER AUTHORIZED
  // // =========================
  // if (eventType === 'TRANSFER_AUTHORIZED') {
  //   const { debitAccount, creditAccount, amount, currency } = payload;
  //   // audit only (NO ledger movement)
  // }


  //  // =========================
  //  // TRANSFER PROCESSED
  //  // =========================
  //   if (eventType === 'TRANSFER_PROCESSED') {
  //     const { debitAccount, creditAccount, amount, currency } = payload;
  //     // audit only (NO ledger movement)






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