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

  // Old payload support
  const oldFormat =
      payload &&
      payload.debitAccount != null &&
      payload.creditAccount != null &&
      payload.amount != null &&
      payload.currency != null;


  // New FX payload support
  const newFormat =
      payload &&
      payload.debitAccount != null &&
      payload.creditAccount != null &&
      payload.sourceAmount != null &&
      payload.sourceCurrency != null &&
      payload.destinationAmount != null &&
      payload.destinationCurrency != null;

  return oldFormat || newFormat;
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
      currency,
    
      sourceAmount,
      sourceCurrency,
      destinationAmount,
      destinationCurrency
    
    } = payload;
    
    
    // Backward compatibility
    const debitAmount =
      sourceAmount || amount;
    
    const debitCurrency =
      sourceCurrency || currency;
    
    const creditAmount =
      destinationAmount || amount;
    
    const creditCurrency =
      destinationCurrency || currency;


    const originalAmount = 
       sourceAmount || amount;

    const originalCurrency = 
       sourceCurrency || currency;
       
    const exchangeRate = 
       payload.exchangeRate || 1;



      const debitExists = await LedgerEntry.findOne({
        where: {
            transferId: event.aggregateId,
            ledgerAccountId: debitAccount,
            type: 'DEBIT',
            reference: event.reference
        },
        transaction
    });


    console.log(
      '[PROJECTION]',
      event.aggregateId,
      debitAccount,
      creditAccount,
      debitAmount,
      creditAmount,
      event.reference
  );


    if (!debitExists) {
      await LedgerEntry.create({
        ledgerAccountId: debitAccount,
        type: 'DEBIT',
        amount: debitAmount,
        currency: debitCurrency,
        
        originalAmount,
        originalCurrency,
        fxRate: exchangeRate,

        reference: event.reference,
        transferId: event.aggregateId,
        description: 'Projection: SETTLED'
      }, { transaction });

    }



    const creditExists = await LedgerEntry.findOne({
      where: {
          transferId: event.aggregateId,
          ledgerAccountId: creditAccount,
          type: 'CREDIT',
          reference: event.reference
      },
      transaction
  });
  
  if (!creditExists) {
      await LedgerEntry.create({
        ledgerAccountId: creditAccount,
        type: 'CREDIT',
        amount: creditAmount,
        currency: creditCurrency,

        originalAmount,
        originalCurrency,
        fxRate: exchangeRate,

        reference: event.reference,
        transferId: event.aggregateId,
        description: 'Projection: SETTLED'
      }, { transaction });
    }

    console.log(
      '[PROJECTION CREATED]',
      event.aggregateId
  );

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
      currency,
   
      sourceAmount,
      sourceCurrency,
      destinationAmount,
      destinationCurrency
   
   } = payload;
   
   
   // Backward compatibility
   const debitAmount =
      sourceAmount || amount;
   
   const debitCurrency =
      sourceCurrency || currency;
   
   const creditAmount =
      destinationAmount || amount;
   
   const creditCurrency =
      destinationCurrency || currency;


    const originalAmount = 
       sourceAmount || amount;

    const originalCurrency = 
       sourceCurrency || currency;

    const exchangeRate = 
       payload.exchangeRate || 1;



      const debitExists = await LedgerEntry.findOne({
        where: {
            transferId: event.aggregateId,
            ledgerAccountId: debitAccount,
            type: 'DEBIT',
            reference: event.reference
        },
        transaction
    });

    if (!debitExists) {
   
   await LedgerEntry.create({
      ledgerAccountId: debitAccount,
      type: 'DEBIT',
      amount: debitAmount,
      currency: debitCurrency,

      originalAmount,
      originalCurrency,
      fxRate: exchangeRate,

      reference: event.reference,
      transferId: event.aggregateId,
      description: 'Projection: REVERSED'
   }, { transaction });

  }


  const creditExists = await LedgerEntry.findOne({
    where: {
        transferId: event.aggregateId,
        ledgerAccountId: creditAccount,
        type: 'CREDIT',
        reference: event.reference
    },
    transaction
});

if (!creditExists) {
   await LedgerEntry.create({
      ledgerAccountId: creditAccount,
      type: 'CREDIT',
      amount: creditAmount,
      currency: creditCurrency,

      originalAmount,
      originalCurrency,
      fxRate: exchangeRate,

      reference: event.reference,
      transferId: event.aggregateId,
      description: 'Projection: REVERSED'
   }, { transaction });
  }

    return true;
  }

  return true;
}

module.exports = {
  projectLedgerEvent
};





