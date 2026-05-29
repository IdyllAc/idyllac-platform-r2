// services/ledger/processTransfer.js
const {
    BankAccount,
    Transaction,
    LedgerAccount,
    LedgerEntry,
    Transfer
  } = require('../../models');
  
  async function processTransfer(event) {
    const { payload } = event;
  
    const sequelize = BankAccount.sequelize;
  
    const t = await sequelize.transaction({
      isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    });
  
    try {
  
      // =========================
      // 1. IDEMPOTENCY GUARD
      // =========================
  
           // NO DB CHECKS HERE ANYMORE
           // OUTBOX guarantees idempotency
  
      // =========================
      // 2. ACCOUNT LOCK
      // =========================
  
      const account = await BankAccount.findOne({
        where: {
          id: payload.senderAccountId,
          userId: payload.userId
        },
        transaction: t,
        lock: t.LOCK.UPDATE
      });
  
      if (!account) throw new Error('Bank account not found');
  
      const amount = parseFloat(payload.amount);
  
      const availableBefore = parseFloat(account.availableBalance);
      const pendingBefore = parseFloat(account.pendingBalance);
  
      const availableAfter = availableBefore - amount;
      const pendingAfter = pendingBefore + amount;
  
      // =========================
      // 3. APPLY UPDATE
      // =========================
  
      await account.update({
        availableBalance: availableAfter,
        pendingBalance: pendingAfter
      }, { transaction: t });
  
      // =========================
      // 4. TRANSACTION RECORD
      // =========================
  
      await Transaction.create({
        bankAccountId: account.id,
        reference: payload.reference,
        type: 'TRANSFER',
        direction: 'DEBIT',
        amount,
        currency: account.currency,
        status: 'PENDING',
        balanceBefore: availableBefore,
        balanceAfter: availableAfter
      }, { transaction: t });
  
      // =========================
      // 5. LEDGERS
      // =========================
  
      const customerLedger = await LedgerAccount.findOne({
        where: {
          userId: payload.userId,
          accountType: 'CUSTOMER'
        },
        transaction: t,
        lock: t.LOCK.UPDATE
      });
  
      const systemLedger = await LedgerAccount.findOne({
        where: {
          accountType: 'SYSTEM_CLEARING'
        },
        transaction: t,
        lock: t.LOCK.UPDATE
      });
  
      if (!customerLedger || !systemLedger)
        throw new Error('Ledger accounts missing');
  
      // =========================
      // 6. DOUBLE ENTRY POSTING
      // =========================

      await postTransaction({

        t,
      
        fromAccount: customerLedger,
      
        toAccount: systemLedger,
      
        amount,
      
        currency: account.currency,
      
        reference: payload.reference,
      
        description: 'Transfer processed',
      
        transferId: event.aggregateId
      
      });
         // NO MANUAL ENTRY CREATION ANYMORE, postTransaction avove handles it with proper validation and consistency checks
      // await LedgerEntry.create({
      //   ledgerAccountId: customerLedger.id,
      //   transferId: event.aggregateId,
      //   reference: payload.reference,
      //   type: 'DEBIT',
      //   amount,
      //   currency: account.currency,
      //   description: 'Transfer debit'
      // }, { transaction: t });

         // NO MANUAL ENTRY CREATION ANYMORE, postTransaction avove handles it with proper validation and consistency checks
      // await LedgerEntry.create({
      //   ledgerAccountId: systemLedger.id,
      //   transferId: event.aggregateId,
      //   reference: payload.reference,
      //   type: 'CREDIT',
      //   amount,
      //   currency: account.currency,
      //   description: 'System clearing credit'
      // }, { transaction: t });
  
      // =========================
      // 7. LEDGER BALANCE UPDATE
      // =========================
  
      await customerLedger.update({
        balance: parseFloat(customerLedger.balance) - amount
      }, { transaction: t });
  
      await systemLedger.update({
        balance: parseFloat(systemLedger.balance) + amount
      }, { transaction: t });
  
      // =========================
      // 8. UPDATE TRANSFER
      // =========================
  
      await Transfer.update(
        { status: 'PROCESSING' },
        {
          where: { id: event.aggregateId },
          transaction: t
        }
      );
  
      // =========================
      // 9. COMMIT
      // =========================
  
      await t.commit();
  
    } catch (err) {
      await t.rollback();
      console.error('processTransfer failed:', err);
      throw err;
    }
  }
  
  module.exports = {
    processTransfer
  };