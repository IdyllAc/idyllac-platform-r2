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

function hasModernLedgerPayload(payload) {
  return (
    payload &&
    payload.debitAccount &&
    payload.creditAccount &&
    payload.amount &&
    payload.currency
  );
}

async function projectLedgerEvent({
  sequelize,
  transaction,
  event,
  accounts
}) {

  const { eventType } = event;
  const payload = event.payload || {};

  // ====================================
  // TRANSFER_SETTLED
  // ====================================
  if (eventType === 'TRANSFER_SETTLED') {

    if (!hasModernLedgerPayload(payload)) {

      console.warn(
        `[PROJECTION] Skipping legacy TRANSFER_SETTLED event ${event.id}`
      );

      return true;
    }

    const {
      debitAccount,
      creditAccount,
      amount,
      currency
    } = payload;

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

    return true;
  }

  // ====================================
  // TRANSFER_REVERSED
  // ====================================
  if (eventType === 'TRANSFER_REVERSED') {

    if (!hasModernLedgerPayload(payload)) {

      console.warn(
        `[PROJECTION] Skipping legacy TRANSFER_REVERSED event ${event.id}`
      );

      return true;
    }

    const {
      debitAccount,
      creditAccount,
      amount,
      currency
    } = payload;

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

    return true;
  }

  return true;
}

module.exports = {
  projectLedgerEvent
};






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





