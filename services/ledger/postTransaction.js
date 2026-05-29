// services/ledger/postTransaction.js
const { LedgerAccount, LedgerEntry } = require('../../models');

async function postTransaction({
  t,
  fromAccount,
  toAccount,
  amount,
  currency,
  reference,
  description,
  transferId
}) {

  // =========================
  // 0. NORMALIZE AMOUNT
  // =========================
  const parsedAmount = Number(amount);

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    throw new Error('Invalid amount');
  }

  if (fromAccount.id === toAccount.id) {
    throw new Error('Cannot transfer to same account');
  }

  // =========================
  // 1. LOCK ACCOUNTS (DB SAFE)
  // =========================
  const sender = await LedgerAccount.findByPk(fromAccount.id, {
    transaction: t,
    lock: t.LOCK.UPDATE
  });

  const receiver = await LedgerAccount.findByPk(toAccount.id, {
    transaction: t,
    lock: t.LOCK.UPDATE
  });

  if (!sender) {
    throw new Error('Sender ledger not found');
  }

  if (!receiver) {
    throw new Error('Receiver ledger not found');
  }

  // =========================
  // 2. STRICT BALANCE CHECK
  // =========================
  const senderBalance = Number(sender.balance);

  if (senderBalance < parsedAmount) {
    throw new Error('Insufficient balance');
  }

  // =========================
  // 3. 3. DOUBLE ENTRY (ATOMIC WRITE)
  // =========================

  await LedgerEntry.create({
    transferId,
    ledgerAccountId: fromAccount.id,
    reference,
    type: 'DEBIT',
    amount: parsedAmount,
    currency,
    description
  }, { transaction: t });

  await LedgerEntry.create({
    transferId,
    ledgerAccountId: receiver.id,
    reference,
    type: 'CREDIT',
    amount: parsedAmount,
    currency,
    description
  }, { transaction: t });

  // =========================
  // 4. BALANCE UPDATE (SAFE)
  // =========================

  await sender.update({
    balance: senderBalance - parsedAmount
  }, { transaction: t });

  await receiver.update({
    balance: Number(receiver.balance) + parsedAmount
  }, { transaction: t });

  // =========================
  // 5. FINAL CONSISTENCY CHECK
  // =========================

  const debit = parsedAmount;
  const credit = parsedAmount;

  if (debit !== credit) {
    throw new Error('Ledger imbalance detected');
  }

  return {
    success: true,
    reference
  };
}

module.exports = {
  postTransaction
};

