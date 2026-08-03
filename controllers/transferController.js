// controllers/transferController.js

const requestTransfer = require('../services/transfers/requestTransfer');
const getTransferService = require('../services/transfers/getTransfer');
const listTransfersService = require('../services/transfers/listTransfers');
const authorizeTransfer = require('../services/transfers/authorizeTransfer');
const processTransfer = require('../services/transfers/processTransfer');
const settleTransfer = require('../services/transfers/settleTransfer');
const completeTransfer = require('../services/transfers/completeTransfer');
const cancelTransfer = require('../services/transfers/cancelTransfer');
const reverseTransfer = require('../services/transfers/reverseTransfer');


const runDailyReconciliation =
    require('../services/ledger/runDailyReconciliation');
 const rebuildTransferAccounting =
    require('../services/ledger/rebuildTransferAccounting');

const combinedAuth = require('../middleware/combinedAuth');
const idempotency = require('../middleware/idempotency');

const {
  Sequelize,
  Transfer,
  Transaction,
  BankAccount,
  Beneficiary,
  LedgerAccount
} = require('../models');
const { report } = require('../routes/beneficiary');


exports.requestTransfer = async (req, res) => {

  try {

      const transfer = await requestTransfer({

          user: req.user,
          body: req.body,
          idempotencyRecord: 
              req.idempotencyRecord

      });

      return res.status(201).json({

          success: true,

          message: 'Transfer created successfully',

          transfer

      });

  } catch (err) {

      console.error(err);

      return res.status(500).json({

          success: false,

          error: err.message

      });

  }

};



exports.listTransfers = async (req, res) => {

  try {

      const transfers = await listTransfersService({

          userId: req.user.id

      });

      return res.json({

          success: true,
          transfers

      });

  } catch (err) {

      console.error(err);

      return res.status(500).json({

          success: false,
          error: err.message

      });

  }

};



exports.getTransfer = async (req, res) => {

  try {

      const transfer = await getTransferService({

          transferId: req.params.id,
          userId: req.user.id

      });

      if (!transfer) {

          return res.status(404).json({

              success: false,
              error: "Transfer not found"

          });

      }

      return res.json({

          success: true,
          transfer

      });

  } catch (err) {

      console.error(err);

      return res.status(500).json({

          success: false,
          error: err.message

      });

  }

};


// exports.requestTransfer = async (req, res) => {
//     const sequelize = BankAccount.sequelize;
//     // const t = await sequelize.transaction();
//      const t = await sequelize.transaction({
//   // await sequelize.transaction(async (t) => {
//       isolationLevel: 
//       // Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
//       Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
//     });
  
//     try {
//       const {
//         senderAccountId,
//         beneficiaryId,
//         amount,
//         description
//       } = req.body;
  
  
//       console.log("senderAccountId:",senderAccountId);
//       console.log("userId:", req.user.id);
  
  
//       const senderAccount = await BankAccount.findOne({
//         where: {
//           id: senderAccountId,
//           userId: req.user.id
//         },
//         lock: t.LOCK.UPDATE,
//         transaction: t,
  
//       });
  
//       if (!senderAccount) {
//         await t.rollback();
//         return res.status(404).json({ error: 'Sender account not found' });
//       }
  
  
//       const beneficiary =
//       await Beneficiary.findOne({
  
//          where: {
  
//             id: beneficiaryId,
  
//             userId: req.user.id
  
//        },
  
//        transaction: t
  
//      });  
  
//       if (!beneficiary) {
//         await t.rollback();
//         return res.status(404).json({ error: 'Beneficiary not found' });
//       }
  
//       if (!beneficiary.isVerified) {
  
//         await t.rollback();
      
//         return res.status(400).json({
      
//           error:
//             'Beneficiary is not verified'
      
//         });
      
//       }
      
//       if (
//         beneficiary.status === 'BLOCKED'
//       ) {
      
//         await t.rollback();
      
//         return res.status(403).json({
//           error:
//             'Beneficiary is blocked'
      
//         });
      
//       }
  
//       const parsedAmount = Number(amount);
//       if (!parsedAmount || parsedAmount <= 0) {
//         await t.rollback();
//         return res.status(400).json({ error: 'Invalid amount' });
//       }
  
//       if (Number(senderAccount.availableBalance) < parsedAmount) {
//         await t.rollback();
//         return res.status(400).json({ error: 'Insufficient balance' });
//       }
  
//       const recipientCurrency = beneficiary.currency;
  
//       const requiresFX =
//         senderAccount.currency !== recipientCurrency;
  
  
//         const transferType =
//           beneficiary.transferNetwork;
  
  
//         console.log('transferType:', transferType);
        
  
//         const feeAmount = calculateFee({  

//             transferType,   

//             amount: parsedAmount, 

//             requiresFX     

//           });
  
  

//         let fx = {
//           amount: parsedAmount,
//           rate: 1,
//           from: senderAccount.currency,
//           to: senderAccount.currency
//         };
        
//         if (requiresFX) {
//           fx = await convertAmount(
//             parsedAmount,
//             senderAccount.currency,
//             recipientCurrency,
//             fxProvider
//           );
//         }
  
//       // const debitAmount = parsedAmount;
//       // const creditAmount = fx.amount;
//       // const fxRate = fx.rate;
  
  
//       const transfer = await Transfer.create({
  
//         userId: req.user.id,
  
//         senderAccountId,
  
//         beneficiaryId,
  
//      // reference: 'TRF-' + Date.now(),
//      // reference: `TRF-${uuidv4()}`,  // Use UUID for better uniqueness
//         reference: `TRF-${Date.now()}`,
//      // reference,
     
//         transferType,
//      // transferType: beneficiary.transferNetwork,
     
  
//         direction: 'OUTBOUND',
  
//         amount: parsedAmount,
  
//      // feeAmount: 0,
//      // feeAmount: '0.00',
//         feeAmount,
  
//      // fxRate: fx.rate,
//         exchangeRate: fx.rate,
  
//         sourceCurrency: senderAccount.currency,
  
//      // destinationCurrency: beneficiary.currency,
//         destinationCurrency: recipientCurrency,
  
//         description,
  
//         status: 'PENDING'
  
//       }, { transaction: t });
  
  
//       await senderAccount.update({     //commiitted suposed
//         availableBalance: 
//            Number(senderAccount.availableBalance) - parsedAmount,
  
//         pendingBalance: 
//            Number(senderAccount.pendingBalance) + parsedAmount
//       }, { transaction: t });
  
  
  
//       await appendLedgerEvent({
  
//         transaction: t,
      
//         aggregateId: transfer.id,
      
//         eventType: 'TRANSFER_CREATED',
      
//         reference: transfer.reference,
      
//         userId: req.user.id,
      
//         payload: {
//           transferId: transfer.id,
//           amount: transfer.amount,
//           senderAccountId: transfer.senderAccountId,
//           beneficiaryId: transfer.beneficiaryId,
//           status: 'PENDING'
//         },
        
//         idempotencyKey: `transfer-created-${transfer.id}`
//         // idempotencyKey: req.idempotencyKey
      
//       });
  
  
//       await t.commit();
  
//        // SUCCESS → COMPLETE
//       if (req.idempotencyRecord) {
      
//         await req.idempotencyRecord.update({
//           status: 'COMPLETED',
//           response: {
//             success: true,
//             transferId: transfer.id,
//           }
      
//         });
      
//       }
      
//       return res.status(201).json({
//         success: true,
//         message: 
//             'Transfer created successfully',
//         transfer
//       });
  
  
//     } catch (err) {
  
//       await t.rollback();
  
//       console.error(err);
  
//         // FAILURE → FAILED
//       if (req.idempotencyRecord) {
//         // await req.idempotencyRecord.destroy();
//         await req.idempotencyRecord.update({
//           status: 'FAILED',
//           retryCount: (req.idempotencyRecord.retryCount || 0) + 1,
  
//           response: {
//             error: 'Transfer creation failed'
//           }
  
//         });
      
//       }
  
//       return res.status(500).json({ 
//         error: 'Transfer creation failed'
//           });
  
//         }
  
//       };










exports.authorizeTransfer = async (req, res) => {

  try {

      const transfer = await authorizeTransfer({

        transferId: req.params.id,
        userId: req.user.id

      });

      return res.json({

          success: true,

          transfer

      });

  } catch (err) {

      console.error(err);

      return res.status(500).json({

          success: false,

          error: err.message

      });

  }

};
    // exports.authorizeTransfer = async (req, res) => {
      
    //       const sequelize = BankAccount.sequelize;
    //       const t = await sequelize.transaction({
    //         isolationLevel: 
    //         Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
    //       });
    
    //       try {
      
    //         const transfer =
    //             await Transfer.findOne({
      
    //               where: {
    //                 id: req.params.id,
    //                 userId: req.user.id
    //              },
      
    //              transaction: t,
      
    //              lock: t.LOCK.UPDATE
      
    //         });
        
      
    //         if (!transfer) {
      
    //           await t.rollback();
      
    //           return res.status(404).json({
    //             error: 'Transfer not found'
    //           });
      
    //         }
      
    //         if (transfer.status !== 'PENDING') {
      
    //           await t.rollback();
      
    //           return res.status(400).json({
    //             error: 'Only PENDING transfers can be authorized'
    //           });
      
    //         }
    
    
    //         await appendLedgerEvent({
    //           transaction: t,
    //           aggregateId: transfer.id,
    //           eventType: 'TRANSFER_AUTHORIZED',
    //           reference: transfer.reference,
    //           userId: req.user.id,
    //           payload: {
    //             status: 'AUTHORIZED'
    //           },
    
    //           idempotencyKey: `transfer-authorized-${transfer.id}`
    //           // idempotencyKey: req.idempotencyKey
    //         });
    
    
    //         await transfer.update({
      
    //           status: 'AUTHORIZED'
      
    //         }, {
      
    //           transaction: t
      
    //         });

      
    //         await t.commit();
      
    //         return res.json({
      
    //           success: true,

    //           transfer
      
    //         });
      
    //       } catch (err) {
      
    //         await t.rollback();
      
    //         console.error(err);
      
    //         return res.status(500).json({
      
    //           error: 'Authorization failed'
      
    //         });
      
    //       }
      
    //     };




    exports.processTransfer = async (req, res) => {

      try {
  
          const transfer = await processTransfer({
  
              transferId: req.params.id,
  
              userId: req.user.id
  
          });
  
          return res.json({
  
              success: true,
  
              transfer
  
          });
  
      } catch (err) {
  
          console.error(err);
  
          return res.status(500).json({
  
              success: false,
  
              error: err.message
  
          });
  
      }
  
  };
        // exports.processTransfer = async (req, res) => {
          
        //       const sequelize = BankAccount.sequelize;
        //        const t = await sequelize.transaction({
        //     isolationLevel: 
        //     // Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
        //     Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        //   });
        
        //       try {
          
        //         const transfer =
        //           await Transfer.findOne({
          
        //             where: {
        //               id: req.params.id,
        //               userId: req.user.id
        //             },
        
        //             lock: t.LOCK.UPDATE,
        //             transaction: t
        
        //             // lock: t.LOCK.UPDATE
        
        //           });
          
        //         if (!transfer) {
          
        //           await t.rollback();
          
        //           return res.status(404).json({
        //             error: 'Transfer not found'
        //           });
          
        //         }
          
        //         if (transfer.status !== 'AUTHORIZED') {
          
        //           await t.rollback();
          
        //           return res.status(400).json({
        //             error: 'Transfer must be AUTHORIZED first'
        //           });
          
        //         }
        
        //         await appendLedgerEvent({
        //           transaction: t,
        //           aggregateId: transfer.id,
        //           eventType: 'TRANSFER_PROCESSING',
        //           reference: transfer.reference,
        //           userId: req.user.id,
        //           payload: {
        //             status: 'PROCESSING'
        //           },
        //           idempotencyKey: `transfer-processing-${transfer.id}`
        //         });
        
        //         // =========================
        //         // TRANSFER STATE UPDATE
        //         // =========================
        //         await transfer.update({
          
        //           status: 'PROCESSING'
          
        //         }, {
          
        //           transaction: t
          
        //         });
          
        //         await t.commit();
          
        //         return res.json({
          
        //           success: true,
        //           transfer
          
        //         });
          
        //       } catch (err) {
          
        //         await t.rollback();
          
        //         console.error(err);
          
        //         return res.status(500).json({
          
        //           error: 'Processing failed'
          
        //         });
          
        //       }
          
        //     };











/**
 * BUSINESS SOURCE OF TRUTH
 *
 * Money movement happens here.
 *
 * CQRS events are emitted AFTER business logic.
 *
 * Do not move balance updates into projections.
 */
  exports.settleTransfer = async (req, res) => {

    try {

      const transfer = await settleTransfer({

          transferId: req.params.id,

          userId: req.user.id

      });

      return res.json({

          success: true,

          transfer

      });

    } catch (err) {
         console.error(err);

         return res.status(500).json({

              success: false,

              error: err.message

          });

       }

    };
  




// /**
//  * BUSINESS SOURCE OF TRUTH
//  *
//  * Money movement happens here.
//  *
//  * CQRS events are emitted AFTER business logic.
//  *
//  * Do not move balance updates into projections.
//  */
//   exports.settleTransfer = async (req, res) => {
  
//     const sequelize = BankAccount.sequelize;
//     const t = await sequelize.transaction({
//   isolationLevel: 
//   // Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
//   Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
// });

//     try {

//       const transfer =
//         await Transfer.findOne({

//           where: {

//             id: req.params.id,

//             userId: req.user.id

//          },

//          lock: t.LOCK.UPDATE,

//          transaction: t

//     });

//       if (!transfer) {

//         await t.rollback();

//         return res.status(404).json({
//           error: 'Transfer not found'
//         });

//       }

//       console.log("SETTLE STATUS:", transfer.status);

//         // =========================
//         // IDEMPOTENCY GUARD (CRITICAL)
//         // =========================

//         // HARD IDENTITY LOCK (IMPORTANT)
//         if (transfer.status === 'SETTLED') {
//           await t.rollback();
//         return res.json({
//         success: true,
//         message: 'Already settled',
//         transferId: transfer.id
//         });
//       }

//       // ONLY PROCESS VALID STATE
//         if (transfer.status !== 'PROCESSING') { 
//           await t.rollback();  
//         return res.status(400).json({
//         error: 'Transfer must be PROCESSING first'
//         });
//       }

//       const account =
//         await BankAccount.findByPk(
//           transfer.senderAccountId,
//           {

//             lock: t.LOCK.UPDATE,

//             transaction: t

//           }
          
//         );

//       if (!account) {

//         await t.rollback();

//         return res.status(404).json({
//           error: 'Bank account not found'
//         });

//       }

//       const amount =
//         parseFloat(transfer.amount);

//       // =========================
//       // BANK ACCOUNT BALANCE FLOW
//       // =========================

//       const pendingBefore =
//          parseFloat(account.pendingBalance);

//       const ledgerBefore =
//          parseFloat(account.ledgerBalance);

//       const balanceBefore =
//          parseFloat(account.balance);

//       const availableBefore =
//          parseFloat(account.availableBalance);

//       const pendingAfter =
//          pendingBefore - amount;

//       const ledgerAfter =
//          ledgerBefore - amount;

//       const balanceAfter =
//          balanceBefore - amount;

//       const availableAfter =
//          availableBefore;
//       // balanceAfter;
//       // availableBefore - amount;



//       console.log({
//         balanceBefore,
//         availableBefore,
//         pendingBefore,
//         amount,
//         balanceAfter,
//         availableAfter,
//         pendingAfter
//       });
         

//       await account.update({

//       pendingBalance:
//          pendingAfter,

//       availableBalance:
//          availableAfter,

//       ledgerBalance:
//          ledgerAfter,

//       balance:
//          balanceAfter

//       }, {

//       transaction: t,

//  });



//       // =========================
//       // SETTLEMENT IDEMPOTENCY CHECK
//       // =========================
//       const settlementReference =
//          `${transfer.reference}-SETTLEMENT`;


//       // TRANSACTION REFERENCE CHECK
//       const existingSettlement =
//         await Transaction.findOne({

//          where: {
//            reference: settlementReference
//           },

//           transaction: t,
//           lock: t.LOCK.UPDATE

//         });

//       if (existingSettlement) {

//         await t.rollback();

//         return res.status(200).json({
//           success: true,
//           message: 'Settlement already processed',
//           transfer
//        });

//      }

      

//       // =========================
//       // REAL DOUBLE-ENTRY LEDGER
//       // =========================

//       const customerLedger =
//         await LedgerAccount.findOne({

//           where: {
//             userId: transfer.userId,
//          // userId: req.user.id,
//             accountType: 'CUSTOMER'
//           },

//           transaction: t,
//           lock: t.LOCK.UPDATE

//         });

//       if (!customerLedger) {

//         await t.rollback();

//         return res.status(404).json({
//           error: 'Customer ledger not found'
//         });

//       }


//       const systemLedger =
//         await LedgerAccount.findOne({

//           where: {
//             accountType: 'SYSTEM_CLEARING'
//           },

//           transaction: t,
//           lock: t.LOCK.UPDATE

//         });

//       if (!systemLedger) {

//         await t.rollback();

//         return res.status(404).json({
//           error: 'System clearing ledger not found'
//         });

//       }


     
//       // =========================
//       // LOAD BENEFICIARY
//       // =========================


//       const beneficiary =
//       await Beneficiary.findByPk(
  
//           transfer.beneficiaryId,
  
//           {
  
//               transaction: t,
  
//               lock:t.LOCK.UPDATE
  
//           }
  
//       );
  
//       if (!beneficiary) {
  
//         throw new Error(
//             'Beneficiary not found'
//         );
    
//     }


//     // =========================
//     // BENEFICIARY ACCOUNT
//     // =========================

//     const beneficiaryAccount =
//         await BankAccount.findByPk(

//             beneficiary.bankAccountId,

//             {

//                 transaction: t,

//                 lock: t.LOCK.UPDATE

//             }

//        );

//    if (!beneficiaryAccount) {

//       throw new Error(
//           'Beneficiary bank account not found'
//       );

//   }  


//     // =========================
//     // BENEFICIARY LEDGER
//     // =========================

//   const beneficiaryLedger =
//     await LedgerAccount.findOne({

//     where: {

//         userId:
//             beneficiaryAccount.userId,

//         accountType: 'CUSTOMER'

//     },

//     transaction: t,

//     lock: t.LOCK.UPDATE

//  });

//  if (!beneficiaryLedger) {

//   throw new Error(
//       'Beneficiary CUSTOMER ledger not found'
//   );

// }



// //
// // =========================
// // CREDIT BENEFICIARY ACCOUNT
// // =========================

// const beneficiaryCredit =

// Number(transfer.amount) *

// Number(transfer.exchangeRate);

// const beneficiaryBalanceBefore =
// Number(beneficiaryAccount.balance);

// const beneficiaryAvailableBefore =
// Number(beneficiaryAccount.availableBalance);

// const beneficiaryLedgerBefore =
// Number(beneficiaryAccount.ledgerBalance);

// await beneficiaryAccount.update({

// balance:
//  beneficiaryBalanceBefore +
//  beneficiaryCredit,

// availableBalance:
//  beneficiaryAvailableBefore +
//  beneficiaryCredit,

// ledgerBalance:
//  beneficiaryLedgerBefore +
//      beneficiaryCredit

// }, {

// transaction: t

// });



//       const requiresFX =
//         transfer.sourceCurrency !==
//         transfer.destinationCurrency;


//       if (requiresFX) {

//          const treasurySource =
//             await getTreasuryAccount(
//                transfer.sourceCurrency,
//                t
//             );

//          const treasuryDestination =
//             await getTreasuryAccount(
//                transfer.destinationCurrency,
//                t
//             );

//          console.log(
//             '[TREASURY FX]',
//             treasurySource.currency,
//             '->',
//             treasuryDestination.currency
//           );


           
//           const { 
//             postFXAccounting 
//           } = require('../services/treasury/postFXAccounting');


//           await postFXAccounting({

//             sourceCurrency:
//                transfer.sourceCurrency,
        
//             destinationCurrency:
//                transfer.destinationCurrency,
        
//             sourceAmount:
//                Number(transfer.amount),
        
//             destinationAmount:
//                Number(transfer.amount)
//                * Number(transfer.exchangeRate),
        
//             marketRate:
//                Number(transfer.exchangeRate),    // - 0.03
        
//             appliedRate:
//                Number(transfer.exchangeRate),
        
//             transaction: t
        
//         });



//         const {
//           distributeFees
//        } = require(
//           '../services/fees/feeEngine'
//        );


//        await distributeFees({

//         transfer,
    
//         transaction: t
    
//     });
    

//       }


      
//       await postTransaction({

//         t,

//         transferId: transfer.id,

//         fromAccount:
//         customerLedger,

//         toAccount:
//           systemLedger,

//         amount,

//         currency:
//           account.currency,

//         reference:
//            settlementReference,
          

//         description:
//           'Transfer settlement'

//       });
      


//       await postTransaction({

//         t,
    
//         transferId: transfer.id,
    
//         fromAccount:
//             systemLedger,
    
//         toAccount:
//             beneficiaryLedger,
    
//         amount:
//             beneficiaryCredit,
    
//         currency:
//             transfer.destinationCurrency,
    
//         reference:
//             settlementReference,
    
//         description:
//             'Beneficiary settlement'
    
//     });


    
//     await Transaction.create({

//       transferId: transfer.id,

//       bankAccountId: transfer.senderAccountId,
    
//       reference:
//              `${transfer.reference}-SETTLEMENT-OUT`,
//             //  settlementReference,
    
//       type:  'TRANSFER',
//           //  transfer.transferType,
    
//       direction: 'DEBIT',
//             //  'OUTBOUND',
//             //  transfer.direction, 
    
//       amount: transfer.amount,
    
//       currency: transfer.sourceCurrency,
    
//       description:
//           transfer.description,
    
//       status: 'COMPLETED',
    
//       balanceBefore: balanceBefore,
    
//       balanceAfter:  balanceAfter
    
//     }, {
//       transaction: t
//     });



//     await Transaction.create({

//       transferId: transfer.id,

//       bankAccountId: 
//               beneficiaryAccount.id,
//           //  beneficiary.bankAccountId,
    
//       reference:
//              `${transfer.reference}-SETTLEMENT-IN`,
//             //  settlementReference,
    
//       type: 'TRANSFER',
//         // transfer.transferType,
    
//       direction: 'CREDIT',
//           //  'INBOUND',
    
//       amount:
//           beneficiaryCredit,
//           // Number(transfer.amount)
//           // * Number(transfer.exchangeRate),
    
//       currency:
//           transfer.destinationCurrency,
    
//       description:
//           transfer.description,
    
//       status: 'COMPLETED',
    
//       balanceBefore:
//              beneficiaryBalanceBefore,
//           // beneficiary.balanceBefore,
    
//       balanceAfter:
//              beneficiaryBalanceBefore +
//              beneficiaryCredit
//           // beneficiary.balanceAfter
    
//     },{
//       transaction:t
//     });



//       // =========================
//       // TRANSACTION JOURNAL
//       // =========================

//       await appendLedgerEvent({

//         transaction: t,

//         userId: transfer.userId,

//         aggregateId: transfer.id,

//         aggregateType: 'TRANSFER',
     
//         eventType: 'TRANSFER_SETTLED',
     
//         reference:
//            `${transfer.reference}-SETTLEMENT`,
     
//         payload: {

//           //  transferType: transfer.transferType,
     
//            debitAccount: customerLedger.id,
     
//            creditAccount: systemLedger.id,
     
//            sourceAmount:
//               Number(transfer.amount),
     
//            sourceCurrency:
//               transfer.sourceCurrency,
     
//            destinationAmount:
//               Number(transfer.amount) *
//               Number(transfer.exchangeRate),
     
//            destinationCurrency:
//               transfer.destinationCurrency,
     
//            exchangeRate:
//               transfer.exchangeRate
//         },

//          idempotencyKey: `transfer-settled-${transfer.id}`
     
//      });
    


//       // =========================
//       // TRANSFER STATE UPDATE
//       // =========================

//       await transfer.update({

//         status:
//           'SETTLED'

//       }, {

//         transaction: t

//       });




//       await t.commit();

//       if (req.idempotencyRecord) {
      
//         await req.idempotencyRecord.update({
//           status: 'COMPLETED',
//           response: {
//             success: true,
//             transferId: transfer.id,
//           }
      
//         });
      
//       }
      
//       return res.json({
//         success: true,
//         message:
//           'Transfer settled successfully',
//         transfer
//       });


//     } catch (err) {

//       await t.rollback();

//       // console.error(err);
//       console.error("SETTLE ERROR FULL:", err);
//       console.error("STACK:", err?.stack);

//       if (req.idempotencyRecord) {
//         // await req.idempotencyRecord.destroy();
//         await req.idempotencyRecord.update({
//             status: 'FAILED',
//             retryCount: (req.idempotencyRecord.retryCount || 0) + 1,

//             response: {
//               error: 'Transfer settlement failed'
//             }
        
//         });
      
//       }

//       return res.status(500).json({
//         error: err.message  // Only for debugging, remove later - in production, return a generic message to avoid leaking internal details
//         // error: err.message || 'Transfer settlement failed'

//         // error:
//         //    'Settlement failed'

//       });

//     };

//   };










 /**
 * BUSINESS SOURCE OF TRUTH
 *
 * Money movement happens here.
 *
 * CQRS events are emitted AFTER business logic.
 *
 * Do not move balance updates into projections.
 */

 exports.completeTransfer = async (req, res) => {

  try {

    const transfer = await completeTransfer({

              transferId: req.params.id,
                userId: req.user.id

            });

            return res.json({
  
              success: true,

              transfer
      
            });

      
          } catch (err) {
               console.error(err);
       
              //  await t.rollback();

               return res.status(500).json({

                success: false,

               error: 'Completion failed'

            });

          }

       };





    

//   /**
//  * BUSINESS SOURCE OF TRUTH
//  *
//  * Money movement happens here.
//  *
//  * CQRS events are emitted AFTER business logic.
//  *
//  * Do not move balance updates into projections.
//  */

//   exports.completeTransfer = async (req, res) => {
  
//       const sequelize = BankAccount.sequelize;

//        const t = await sequelize.transaction({
//     isolationLevel: 
//     // Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
//     Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
//   });
  
//         try {
  
//           const transfer =
//             await Transfer.findOne({
  
//               where: {
//                 id: req.params.id,
//                 userId: req.user.id
//              },

//              lock: t.LOCK.UPDATE,
//              transaction: t
  
//         });
    
  
//         if (!transfer) {
  
//           await t.rollback();
  
//           return res.status(404).json({
//             error: 'Transfer not found'
//           });
  
//         }



//         // =========================
//         // ALREADY COMPLETED
//         // =========================

//         if (transfer.status === 'COMPLETED') {

//           await t.rollback();

//             return res.status(409).json({
//               error: 'Transfer already completed'
//             });

//           }

  
//         // =========================
//         // ONLY SETTLED TRANSFERS
//         // CAN BE MARKED SETTLED
//         // =========================

//           if (transfer.status !== 'SETTLED') {

//             await t.rollback();
    
//             return res.status(400).json({
//               error: 'Only SETTLED transfers can be completed'
//             });
    
//           }


//           await appendLedgerEvent({
//             transaction: t,
//             aggregateId: transfer.id,
//             eventType: 'TRANSFER_COMPLETED',
//             reference: transfer.reference,
//             userId: req.user.id,
//             payload: {
//               status: 'COMPLETED'
//             },
//             idempotencyKey: `transfer-completed-${transfer.id}`
//           });


//           // =========================
//           // COMPLETE TRANSFER
//           // =========================

//           await transfer.update({
  
//           status: 'COMPLETED',
  
//           executedAt: new Date()
  
//         }, {
  
//           transaction: t
  
//         });


//         // =========================
//         // COMMIT
//        // =========================

//         await t.commit();
  
//         return res.json({
  
//           success: true,
//           transfer
  
//         });
  
    
  
//       } catch (err) {
//            console.error(err);
            
//           await t.rollback();
    
//           return res.status(500).json({
    
//             error:
//               'Completion failed'
    
//           });
    
//         }
//       };















/**
 * BUSINESS SOURCE OF TRUTH
 *
 * Money movement happens here.
 *
 * CQRS events are emitted AFTER business logic.
 *
 * Do not move balance updates into projections.
 */
exports.reverseTransfer = async (req, res) => {
  try {

    const transfer = await reverseTransfer({

      transferId: req.params.id,
      userId: req.user.id

    });

    return res.json({

      success: true,
      transfer

    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({

      success: false,
      error: err.message

    });

  }
};
//  /**
//  * BUSINESS SOURCE OF TRUTH
//  *
//  * Money movement happens here.
//  *
//  * CQRS events are emitted AFTER business logic.
//  *
//  * Do not move balance updates into projections.
//  */
//   exports.reverseTransfer = async (req, res) => {

//     const sequelize = BankAccount.sequelize;
  
//     const t = await sequelize.transaction({
//       isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
//     });
  
//     try {
  
//       // =========================
//       // 1. FIND TRANSFER (LOCKED)
//       // =========================
//       const transfer = await Transfer.findOne({
//         where: {
//           id: req.params.id,
//           userId: req.user.id
//         },
//         transaction: t,
//         lock: t.LOCK.UPDATE
//       });
  
//       if (!transfer) {
//         await t.rollback();
//         return res.status(404).json({ error: "Transfer not found" });
//       }
  
//       // =========================
//       // 2. STATE CHECK
//       // =========================
//       if (transfer.status === 'REVERSED') {
//         await t.rollback();
//         return res.status(409).json({ error: "Transfer already reversed" });
//       }
  
//       if (!['SETTLED', 'COMPLETED'].includes(transfer.status)) {
//         await t.rollback();
//         return res.status(400).json({
//           error: "Only SETTLED or COMPLETED transfers can be reversed"
//         });
//       }
  
//       // =========================
//       // 3. IDENTITY / REFERENCE (SOURCE OF TRUTH)
//       // =========================
//       const reversalReference = `REV-${transfer.reference}`;
//       const reversalAmount = parseFloat(transfer.amount);
  
//       // =========================
//       // 4. IDEMPOTENCY CHECK (IMPORTANT)
//       // =========================
//       const existing = await Transaction.findOne({
//         where: { reference: reversalReference },
//         transaction: t
//       });
  
//       if (existing) {
//         await t.rollback();
//         return res.json({
//           success: true,
//           message: "Already reversed",
//           reference: reversalReference
//         });
//       }
  
//       // =========================
//       // 5. BANK ACCOUNT
//       // =========================
//       const account = await BankAccount.findOne({
//         where: { id: transfer.senderAccountId },
//         transaction: t,
//         lock: t.LOCK.UPDATE
//       });
  
//       if (!account) {
//         await t.rollback();
//         return res.status(404).json({ error: "Bank account not found" });
//       }
  
//       // =========================
//       // 6. LEDGER ACCOUNTS
//       // =========================
//       const customerLedger = await LedgerAccount.findOne({
//         where: {
//           userId: req.user.id,
//           accountType: 'CUSTOMER'
//         },
//         transaction: t,
//         lock: t.LOCK.UPDATE
//       });
  
//       const systemLedger = await LedgerAccount.findOne({
//         where: {
//           accountType: 'SYSTEM_CLEARING'
//         },
//         transaction: t,
//         lock: t.LOCK.UPDATE
//       });
  
//       if (!customerLedger || !systemLedger) {
//         await t.rollback();
//         return res.status(404).json({
//           error: "Ledger accounts missing"
//         });
//       }
  
//       // =========================
//       // 7. VALIDATE LEDGER SYMMETRY
//       // =========================
//       await validateLedger({
//         t,
//         reference: reversalReference,
//         currency: account.currency,
//         debitEntries: [
//           {
//             amount: reversalAmount,
//             currency: account.currency
//           }
//         ],
//         creditEntries: [
//           {
//             amount: reversalAmount,
//             currency: account.currency
//           }
//         ]
//       });
  
//       // =========================
//       // 8. POST REVERSAL (ONLY ONCE)
//       // IMPORTANT: USE SAME REFERENCE
//       // =========================
//       await postTransaction({
//         t,
//         fromAccount: systemLedger,
//         toAccount: customerLedger,
//         amount: reversalAmount,
//         currency: account.currency,
//         reference: reversalReference,
//         description: "Transfer reversal",
//         transferId: transfer.id
//       });
  
//       // =========================
//       // 9. RESTORE BANK BALANCES
//       // =========================
//       await account.update({
//         balance: parseFloat(account.balance) + reversalAmount,
//         ledgerBalance: parseFloat(account.ledgerBalance) + reversalAmount,
//         availableBalance: parseFloat(account.availableBalance) + reversalAmount
//       }, { transaction: t });


//       await appendLedgerEvent({
//        sequelize,
//         transaction: t,
//         aggregateId: transfer.id,
//         eventType: 'TRANSFER_REVERSED',
//         reference: reversalReference,
//         userId: req.user.id,
        
//         payload: {
//           debitAccount: systemLedger.id,
//           creditAccount: customerLedger.id,
//           amount: reversalAmount,
//           currency: account.currency,
//           reversalReference
//         },
//         idempotencyKey: `transfer-reversed-${transfer.id}`
//       });
  
  
//       // =========================
//       // 11. FINAL STATE
//       // =========================
//       await transfer.update({
//         status: 'REVERSED'
//       }, { transaction: t });
  
//       await t.commit();
  
//       return res.json({
//         success: true,
//         message: "Transfer reversed successfully",
//         transfer
//       });
  
//     } catch (err) {
//       await t.rollback();
  
//       console.error("REVERSE ERROR:", err);
  
//       return res.status(500).json({
//         error: err.message

//       });

//     }

//   };





  exports.cancelTransfer = async (req, res) => {

    try {

      const transfer = await cancelTransfer({

              transferId: req.params.id,
              userId: req.user.id

      })
  
        return res.json({
  
          success: true,

          transfer
  
        });
  
      } catch (err) {

        console.error(err);
  
        return res.status(500).json({

          success: false,
  
          error:'Cancellation failed'
  
        });
  
      }
  
    };
  // exports.cancelTransfer = async (req, res) => {
  
  //     const sequelize = BankAccount.sequelize;
  //     const t = await sequelize.transaction({
  //       isolationLevel: 
  //       // Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
  //       Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  //     });
  
  //     try {
  
  //       const transfer =
  //         await Transfer.findOne({
  
  //           where: {
  //             id: req.params.id,
  //             userId: req.user.id
  //           },

  //           lock: t.LOCK.UPDATE,

  //           transaction: t

  //           // lock: t.LOCK.UPDATE

  //         });
  
  //       if (!transfer) {
  
  //         await t.rollback();
  
  //         return res.status(404).json({
  //           error: 'Transfer not found'
  //         });
  
  //       }
  
  //       if (
  //         transfer.status !== 'PENDING' &&
  //         transfer.status !== 'AUTHORIZED'
  //       ) {
  
  //         await t.rollback();
  
  //         return res.status(400).json({
  //           error:
  //             'Only PENDING or AUTHORIZED transfers can be cancelled'
  //         });
  
  //       }
  
  //       const account =
  //         await BankAccount.findByPk(
  //           transfer.senderAccountId,
  //           {

  //             lock: t.LOCK.UPDATE,

  //             transaction: t

  //             // lock: t.LOCK.UPDATE

  //           }
  //         );
  
  //       if (!account) {
  
  //         await t.rollback();
  
  //         return res.status(404).json({
  //           error: 'Account not found'
  //         });
  
  //       }
  
  //       const amount =
  //         parseFloat(transfer.amount);
  
  //       const availableBefore =
  //         parseFloat(account.availableBalance);
  
  //       const pendingBefore =
  //         parseFloat(account.pendingBalance);
  
  //       const availableAfter =
  //         availableBefore + amount;
  
  //       const pendingAfter =
  //         pendingBefore - amount;
  
  //       await account.update({
  
  //         availableBalance:
  //           availableAfter,
  
  //         pendingBalance:
  //           pendingAfter
  
  //       }, {
  
  //         transaction: t
  
  //       });
  
  //       await transfer.update({
  
  //         status: 'CANCELLED'
  
  //       }, {
  
  //         transaction: t
  
  //       });
  
        
  
  //       await t.commit();
  
  //       return res.json({
  
  //         success: true,
  //         transfer
  
  //       });
  
  //     } catch (err) {
  
  //       await t.rollback();
  
  //       console.error(err);
  
  //       return res.status(500).json({
  
  //         error:
  //           'Cancellation failed'
  
  //       });
  
  //     }
  
  //   };



  




    // GET DAILY RUNRECONCILIATION
    exports.reconcileTransfers = async (req, res) => {
      
          try {
      
            const report =
              await runDailyReconciliation();
      
            return res.json(report);
      
          } catch (err) {
      
            console.error(err);
      
            return res.status(500).json({

              error: err.message
              // error:
              //   'Reconciliation failed'
      
            });
      
          }
      
        };





        exports.rebuildTransferLedger = async (req, res) => {

          const sequelize = require('../models').sequelize;
      
          const t = await sequelize.transaction();
      
          try {
      
              const result = await rebuildTransferAccounting({
      
                  transferId: Number(req.params.id),
      
                  transaction: t
      
              });
      
              await t.commit();
      
              return res.json({
      
                  success: true,
      
                  repaired: result
      
              });
      
          } catch (err) {
      
              await t.rollback();
      
              console.error(err);
      
              return res.status(500).json({
      
                  success: false,
      
                  error: err.message
      
              });
      
          }
      
      };
        

    



   
