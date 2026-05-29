// services/ledger/validateLedger.js

const {
    LedgerEntry
  } = require('../../models');
  
  async function validateLedger({
  
    t,
  
    debitEntries = [],
    creditEntries = [],
  
    reference,
  
    currency
  
  }) {
  
    // =========================
    // BASIC VALIDATION
    // =========================
  
    if (!reference) {
  
      throw new Error(
        'Ledger validation failed: missing reference'
      );
  
    }
  
    if (!currency) {
  
      throw new Error(
        'Ledger validation failed: missing currency'
      );
  
    }
  
    // =========================
    // ENTRY EXISTENCE
    // =========================
  
    if (
      debitEntries.length === 0 ||
      creditEntries.length === 0
    ) {
  
      throw new Error(
        'Ledger validation failed: missing debit or credit entries'
      );
  
    }
  
    // =========================
    // BALANCE VALIDATION
    // =========================
  
    const totalDebits =
      debitEntries.reduce(
        (sum, entry) =>
          sum + parseFloat(entry.amount),
        0
      );
  
    const totalCredits =
      creditEntries.reduce(
        (sum, entry) =>
          sum + parseFloat(entry.amount),
        0
      );
  
    if (totalDebits !== totalCredits) {
  
      throw new Error(
        'Ledger validation failed: debits and credits do not balance'
      );
  
    }
  
    // =========================
    // CURRENCY VALIDATION
    // =========================
  
    const invalidCurrency =
      [...debitEntries, ...creditEntries]
        .find(
          entry =>
            entry.currency !== currency
        );
  
    if (invalidCurrency) {
  
      throw new Error(
        'Ledger validation failed: currency mismatch'
      );
  
    }
  
    // =========================
    // DUPLICATE REFERENCE CHECK
    // =========================
  
    const existingReference =
      await LedgerEntry.findOne({
  
        where: {
          reference
        },
  
        transaction: t
  
      });
  
    if (existingReference) {
  
      throw new Error(
        'Ledger validation failed: duplicate reference'
      );
  
    }
  
    // =========================
    // NEGATIVE / INVALID AMOUNTS
    // =========================
  
    const invalidAmount =
      [...debitEntries, ...creditEntries]
        .find(entry =>
          parseFloat(entry.amount) <= 0
        );
  
    if (invalidAmount) {
  
      throw new Error(
        'Ledger validation failed: invalid amount'
      );
  
    }
  
    return true;
  
  }
  
  module.exports = validateLedger;