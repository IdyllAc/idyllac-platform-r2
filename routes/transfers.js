// routes/transfers.js
const express = require('express');
const router = express.Router();

// const { Sequelize } = require('../models');
// const { v4: uuidv4 } = require('uuid');

const { postTransaction } = require('../services/ledger/postTransaction');

const {
  Sequelize,
  Transfer,
  Transaction,
  BankAccount,
  Beneficiary,
  LedgerAccount,
  LedgerEntry
} = require('../models');

const combinedAuth = require('../middleware/combinedAuth');
const idempotency = require('../middleware/idempotency');
const validateLedger = require('../services/ledger/validateLedger');
const runDailyReconciliation = require('../services/ledger/runDailyReconciliation');
const createEvent = require('../services/events/createEvent');
const convertAmount = require('../services/fx/convertAmount');
const fxProvider = require('../services/fx/fxProvider');



router.post('/create', combinedAuth, idempotency, async (req, res) => {
  const sequelize = BankAccount.sequelize;
  // const t = await sequelize.transaction();
   const t = await sequelize.transaction({
// await sequelize.transaction(async (t) => {
    isolationLevel: 
    // Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
    Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  });

  try {
    const {
      senderAccountId,
      beneficiaryId,
      amount,
      description
    } = req.body;


    console.log("senderAccountId:",senderAccountId);
    console.log("userId:", req.user.id);


    const senderAccount = await BankAccount.findOne({
      where: {
        id: senderAccountId,
        userId: req.user.id
      },
      lock: t.LOCK.UPDATE,
      transaction: t,

    });

    if (!senderAccount) {
      await t.rollback();
      return res.status(404).json({ error: 'Sender account not found' });
    }

    const beneficiary = await Beneficiary.findByPk(beneficiaryId, {
      transaction: t
    });

    if (!beneficiary) {
      await t.rollback();
      return res.status(404).json({ error: 'Beneficiary not found' });
    }

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (Number(senderAccount.availableBalance) < parsedAmount) {
      await t.rollback();
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const recipientCurrency = beneficiary.currency;

    const requiresFX =
      senderAccount.currency !== recipientCurrency;

      let fx = {
        amount: parsedAmount,
        rate: 1,
        from: senderAccount.currency,
        to: senderAccount.currency
      };
      
      if (requiresFX) {
        fx = await convertAmount(
          parsedAmount,
          senderAccount.currency,
          recipientCurrency,
          fxProvider
        );
      }

    // const debitAmount = parsedAmount;
    // const creditAmount = fx.amount;
    // const fxRate = fx.rate;


    const transfer = await Transfer.create({
      userId: req.user.id,
      senderAccountId,
      beneficiaryId,

      reference: `TRF-${Date.now()}`,
   // reference: 'TRF-' + Date.now(),
   // reference: `TRF-${uuidv4()}`,  // Use UUID for better uniqueness
      transferType: beneficiary.transferNetwork,

      amount: parsedAmount,

      sourceCurrency: senderAccount.currency,
      destinationCurrency: beneficiary.currency,

      description,

      status: 'PENDING'
    }, { transaction: t });

    await senderAccount.update({     //commiitted suposed
      availableBalance: Number(senderAccount.availableBalance) - parsedAmount,
      pendingBalance: Number(senderAccount.pendingBalance) + parsedAmount
    }, { transaction: t });

    await Transaction.create({     //commiitted suposed
      bankAccountId: senderAccount.id,
      reference: transfer.reference,
      type: 'TRANSFER',
      direction: 'DEBIT',
      amount: parsedAmount,
      currency: senderAccount.currency,
      status: 'PENDING',
      balanceBefore: senderAccount.availableBalance,
      balanceAfter: Number(senderAccount.availableBalance) - parsedAmount
    }, { transaction: t });

    await createEvent({
      t,
      aggregateId: transfer.id,
      eventType: 'TRANSFER_CREATED',
      payload: {
        userId: req.user.id,

        transferId: transfer.id,

        reference: transfer.reference,

        amount: transfer.amount,

        senderAccountId: transfer.senderAccountId,
        beneficiaryId: transfer.beneficiaryId,

        // transferType: transfer.transferType,

        // sourceCurrency: transfer.sourceCurrency,
        // destinationCurrency: transfer.destinationCurrency,

        // description: transfer.description,

         status: 'PENDING'       
      }
    });

    await t.commit();

     // SUCCESS → COMPLETE
    if (req.idempotencyRecord) {
    
      await req.idempotencyRecord.update({
        status: 'COMPLETED',
        response: {
          success: true,
          transferId: transfer.id,
          // message:
          // 'Transfer created successfully',
          // transfer
        }
    
      });
    
    }
    
    return res.status(201).json({
      success: true,
      message: 
          'Transfer created successfully',
      transfer
    });


  } catch (err) {

    await t.rollback();

    console.error(err);

      // FAILURE → FAILED
    if (req.idempotencyRecord) {
      // await req.idempotencyRecord.destroy();
      await req.idempotencyRecord.update({
        status: 'FAILED',
        retryCount: (req.idempotencyRecord.retryCount || 0) + 1,

        response: {
          error: 'Transfer creation failed'
        }

      });
    
    }

    return res.status(500).json({ 
      error: 'Transfer creation failed'
        });

      }

    }
  );




  router.post(
    '/authorize/:id',
    combinedAuth,
    async (req, res) => {
  
      const sequelize = BankAccount.sequelize;
      const t = await sequelize.transaction({
        isolationLevel: 
        Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
      });

      try {
  
        const transfer =
            await Transfer.findOne({
  
              where: {
                id: req.params.id,
                userId: req.user.id
             },
  
             transaction: t,
  
             lock: t.LOCK.UPDATE
  
        });
    
  
        if (!transfer) {
  
          await t.rollback();
  
          return res.status(404).json({
            error: 'Transfer not found'
          });
  
        }
  
        if (transfer.status !== 'PENDING') {
  
          await t.rollback();
  
          return res.status(400).json({
            error: 'Only PENDING transfers can be authorized'
          });
  
        }
  
        await transfer.update({
  
          status: 'AUTHORIZED'
  
        }, {
  
          transaction: t
  
        });
  
        await t.commit();
  
        return res.json({
  
          success: true,
          transfer
  
        });
  
      } catch (err) {
  
        await t.rollback();
  
        console.error(err);
  
        return res.status(500).json({
  
          error: 'Authorization failed'
  
        });
  
      }
  
    }
  );



  router.post(
    '/processing/:id',
    combinedAuth,
    async (req, res) => {
  
      const sequelize = BankAccount.sequelize;
       const t = await sequelize.transaction({
    isolationLevel: 
    // Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
    Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  });

      try {
  
        const transfer =
          await Transfer.findOne({
  
            where: {
              id: req.params.id,
              userId: req.user.id
            },

            lock: t.LOCK.UPDATE,
            transaction: t

            // lock: t.LOCK.UPDATE

          });
  
        if (!transfer) {
  
          await t.rollback();
  
          return res.status(404).json({
            error: 'Transfer not found'
          });
  
        }
  
        if (transfer.status !== 'AUTHORIZED') {
  
          await t.rollback();
  
          return res.status(400).json({
            error: 'Transfer must be AUTHORIZED first'
          });
  
        }
  
        await transfer.update({
  
          status: 'PROCESSING'
  
        }, {
  
          transaction: t
  
        });
  
        await t.commit();
  
        return res.json({
  
          success: true,
          transfer
  
        });
  
      } catch (err) {
  
        await t.rollback();
  
        console.error(err);
  
        return res.status(500).json({
  
          error: 'Processing failed'
  
        });
  
      }
  
    }
  );



  router.post('/settle/:id', combinedAuth, idempotency, async (req, res) => {
  
      const sequelize = BankAccount.sequelize;
      const t = await sequelize.transaction({
    isolationLevel: 
    // Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
    Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  });
  
      try {
  
        const transfer =
          await Transfer.findOne({

            where: {
              id: req.params.id,
              userId: req.user.id
           },

           lock: t.LOCK.UPDATE,
           transaction: t

          //  lock: t.LOCK.UPDATE

      });
  
        if (!transfer) {
  
          await t.rollback();
  
          return res.status(404).json({
            error: 'Transfer not found'
          });
  
        }
  
        if (transfer.status !== 'PROCESSING') {
  
          await t.rollback();
  
          return res.status(400).json({
            error: 'Transfer must be PROCESSING'
          });
  
        }
  
        const account =
          await BankAccount.findByPk(
            transfer.senderAccountId,
            {
              transaction: t,

              lock: t.LOCK.UPDATE
            }
          );
  
        if (!account) {
  
          await t.rollback();
  
          return res.status(404).json({
            error: 'Bank account not found'
          });
  
        }
  
        const amount =
          parseFloat(transfer.amount);
  
        // =========================
// BANK ACCOUNT BALANCE FLOW
// =========================

const pendingBefore =
parseFloat(account.pendingBalance);

const ledgerBefore =
parseFloat(account.ledgerBalance);

const balanceBefore =
parseFloat(account.balance);

const availableBefore =
parseFloat(account.availableBalance);

const pendingAfter =
pendingBefore - amount;

const ledgerAfter =
ledgerBefore - amount;

const balanceAfter =
balanceBefore - amount;

const availableAfter =
availableBefore - amount;

await account.update({

pendingBalance:
  pendingAfter,

availableBalance:
  availableAfter,

ledgerBalance:
  ledgerAfter,

balance:
  balanceAfter

}, {

transaction: t,

});


        // =========================
        // SETTLEMENT IDEMPOTENCY CHECK
        // =========================
        const settlementReference =
           `${transfer.reference}-SETTLEMENT`;


        // TRANSACTION REFERENCE CHECK
        const existingSettlement =
          await Transaction.findOne({

           where: {
             reference: settlementReference
            },

            transaction: t,
            lock: t.LOCK.UPDATE

          });

        if (existingSettlement) {

          await t.rollback();

          return res.status(200).json({
            success: true,
            message: 'Settlement already processed',
            transfer
         });

       }
  
        // =========================
        // TRANSACTION JOURNAL
        // =========================
  
        await Transaction.create({
  
          bankAccountId:
            account.id,
  
          reference:
            settlementReference,
  
          type:
            'TRANSFER',
  
          direction:
            'DEBIT',
  
          amount,
  
          currency:
            account.currency,
  
          description:
            'Transfer settled',
  
          status:
            'COMPLETED',
  
          balanceBefore:
            ledgerBefore,
  
          balanceAfter:
            ledgerAfter
  
        }, {
  
          transaction: t
  
        });
  
        // =========================
        // REAL DOUBLE-ENTRY LEDGER
        // =========================
  
        const senderLedger =
          await LedgerAccount.findOne({
  
            where: {
              userId: req.user.id,
              accountType: 'CUSTOMER'
            },
  
            transaction: t,
            lock: t.LOCK.UPDATE
  
          });
  
        if (!senderLedger) {
  
          await t.rollback();
  
          return res.status(404).json({
            error: 'Customer ledger not found'
          });
  
        }
  

        const systemLedger =
          await LedgerAccount.findOne({
  
            where: {
              accountType: 'SYSTEM_CLEARING'
            },
  
            transaction: t,
            lock: t.LOCK.UPDATE
  
          });
  
        if (!systemLedger) {
  
          await t.rollback();
  
          return res.status(404).json({
            error: 'System clearing ledger not found'
          });
  
        }

  
        await postTransaction({
  
          t,

          transferId: transfer.id,
  
          fromAccount:
            senderLedger,
  
          toAccount:
            systemLedger,
  
          amount,
  
          currency:
            account.currency,
  
          reference:
             settlementReference,
            
  
          description:
            'Transfer settlement'
  
        });
  
        // =========================
        // TRANSFER STATE UPDATE
        // =========================
  
        await transfer.update({
  
          status:
            'SETTLED'
  
        }, {
  
          transaction: t
  
        });
  
        await t.commit();

        if (req.idempotencyRecord) {
        
          await req.idempotencyRecord.update({
            status: 'COMPLETED',
            response: {
              success: true,
              transferId: transfer.id,
            }
        
          });
        
        }
        
        return res.json({
          success: true,
          message:
            'Transfer settled successfully',
          transfer
        });
  

      } catch (err) {
  
        await t.rollback();
  
        // console.error(err);
        console.error("SETTLE ERROR FULL:", err);
        console.error("STACK:", err?.stack);

        if (req.idempotencyRecord) {
          // await req.idempotencyRecord.destroy();
          await req.idempotencyRecord.update({
              status: 'FAILED',
              retryCount: (req.idempotencyRecord.retryCount || 0) + 1,

              response: {
                error: 'Transfer settlement failed'
              }
          
          });
        
        }
  
        return res.status(500).json({
          error: err.message  // Only for debugging, remove later - in production, return a generic message to avoid leaking internal details
          // error: err.message || 'Transfer settlement failed'
  
          // error:
          //    'Settlement failed'
  
        });
  
      }
  
    }
  );







  router.post(
    '/complete/:id',
    combinedAuth,
    async (req, res) => {
  
      const sequelize = BankAccount.sequelize;
       const t = await sequelize.transaction({
    isolationLevel: 
    // Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
    Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
  });
  
        try {
  
          const transfer =
            await Transfer.findOne({
  
              where: {
                id: req.params.id,
                userId: req.user.id
             },

             lock: t.LOCK.UPDATE,
             transaction: t
  
        });
    
  
        if (!transfer) {
  
          await t.rollback();
  
          return res.status(404).json({
            error: 'Transfer not found'
          });
  
        }



        // =========================
        // ALREADY COMPLETED
        // =========================

        if (transfer.status === 'COMPLETED') {

          await t.rollback();

            return res.status(409).json({
              error: 'Transfer already completed'
            });

          }

  
        // =========================
        // ONLY SETTLED TRANSFERS
        // CAN BE MARKED SETTLED
        // =========================

          if (transfer.status !== 'SETTLED') {

            await t.rollback();
    
            return res.status(400).json({
              error: 'Only SETTLED transfers can be completed'
            });
    
          }


          // =========================
          // COMPLETE TRANSFER
          // =========================

          await transfer.update({
  
          status: 'COMPLETED',
  
          executedAt: new Date()
  
        }, {
  
          transaction: t
  
        });


        // =========================
        // COMMIT
       // =========================


        
        await t.commit();
  
        return res.json({
  
          success: true,
          transfer
  
        });
  
    
  
      } catch (err) {
            
          await t.rollback();
    
          console.error(err);
    
          return res.status(500).json({
    
            error:
              'Completion failed'
    
          });
    
        }
      }
  )



  router.post('/reverse/:id', combinedAuth, idempotency, async (req, res) => {

    const sequelize = BankAccount.sequelize;
  
    const t = await sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    });
  
    try {
  
      // =========================
      // 1. FIND TRANSFER (LOCKED)
      // =========================
      const transfer = await Transfer.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        },
        transaction: t,
        lock: t.LOCK.UPDATE
      });
  
      if (!transfer) {
        await t.rollback();
        return res.status(404).json({ error: "Transfer not found" });
      }
  
      // =========================
      // 2. STATE CHECK
      // =========================
      if (transfer.status === 'REVERSED') {
        await t.rollback();
        return res.status(409).json({ error: "Transfer already reversed" });
      }
  
      if (!['SETTLED', 'COMPLETED'].includes(transfer.status)) {
        await t.rollback();
        return res.status(400).json({
          error: "Only SETTLED or COMPLETED transfers can be reversed"
        });
      }
  
      // =========================
      // 3. IDENTITY / REFERENCE (SOURCE OF TRUTH)
      // =========================
      const reversalReference = `REV-${transfer.reference}`;
      const reversalAmount = parseFloat(transfer.amount);
  
      // =========================
      // 4. IDEMPOTENCY CHECK (IMPORTANT)
      // =========================
      const existing = await Transaction.findOne({
        where: { reference: reversalReference },
        transaction: t
      });
  
      if (existing) {
        await t.rollback();
        return res.json({
          success: true,
          message: "Already reversed",
          reference: reversalReference
        });
      }
  
      // =========================
      // 5. BANK ACCOUNT
      // =========================
      const account = await BankAccount.findOne({
        where: { id: transfer.senderAccountId },
        transaction: t,
        lock: t.LOCK.UPDATE
      });
  
      if (!account) {
        await t.rollback();
        return res.status(404).json({ error: "Bank account not found" });
      }
  
      // =========================
      // 6. LEDGER ACCOUNTS
      // =========================
      const customerLedger = await LedgerAccount.findOne({
        where: {
          userId: req.user.id,
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
  
      if (!customerLedger || !systemLedger) {
        await t.rollback();
        return res.status(404).json({
          error: "Ledger accounts missing"
        });
      }
  
      // =========================
      // 7. VALIDATE LEDGER SYMMETRY
      // =========================
      await validateLedger({
        t,
        reference: reversalReference,
        currency: account.currency,
        debitEntries: [
          {
            amount: reversalAmount,
            currency: account.currency
          }
        ],
        creditEntries: [
          {
            amount: reversalAmount,
            currency: account.currency
          }
        ]
      });
  
      // =========================
      // 8. POST REVERSAL (ONLY ONCE)
      // IMPORTANT: USE SAME REFERENCE
      // =========================
      await postTransaction({
        t,
        fromAccount: systemLedger,
        toAccount: customerLedger,
        amount: reversalAmount,
        currency: account.currency,
        reference: reversalReference,
        description: "Transfer reversal",
        transferId: transfer.id
      });
  
      // =========================
      // 9. RESTORE BANK BALANCES
      // =========================
      await account.update({
        balance: parseFloat(account.balance) + reversalAmount,
        ledgerBalance: parseFloat(account.ledgerBalance) + reversalAmount,
        availableBalance: parseFloat(account.availableBalance) + reversalAmount
      }, { transaction: t });
  
      // =========================
      // 10. JOURNAL ENTRY
      // =========================
      await Transaction.create({
        bankAccountId: account.id,
        reference: reversalReference,
        type: 'REVERSAL',
        direction: 'CREDIT',
        amount: reversalAmount,
        currency: account.currency,
        description: 'Transfer reversed',
        status: 'COMPLETED'
      }, { transaction: t });
  
      // =========================
      // 11. FINAL STATE
      // =========================
      await transfer.update({
        status: 'REVERSED'
      }, { transaction: t });
  
      await t.commit();
  
      return res.json({
        success: true,
        message: "Transfer reversed successfully",
        transfer
      });
  
    } catch (err) {
      await t.rollback();
  
      console.error("REVERSE ERROR:", err);
  
      return res.status(500).json({
        error: err.message
      });
    }
  });

//  router.post('/reverse/:id', combinedAuth, idempotency, async (req, res) => {

//   const sequelize = BankAccount.sequelize;

//   const t = await sequelize.transaction({
//     isolationLevel: 
//     Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
//   });

//   // =========================
//   // FIND TRANSFER
//   // =========================

//   try {

//     const transfer = await Transfer.findOne({
//       where: {
//         id: req.params.id,
//         userId: req.user.id
//       },
//       transaction: t,

//       lock: t.LOCK.UPDATE
//     });

//     if (!transfer) {

//       await t.rollback();
      
//       return res.status(404).json({ error: "Transfer not found" });
//     }

//     console.log("TRANSFER OBJECT:", transfer);

//     // 2. NOW SAFE TO USE IT FOR LOGGING AND IDEMPOTENCY CHECKS WITHOUT RISK OF LOCK CONTENTION
//     const reversalReference = `REV-${transfer.reference}`;

//     const existingReversal = await Transaction.findOne({
//       where: {
//          reference: reversalReference
//        },
//       transaction: t,
//       lock: t.LOCK.UPDATE
//     });

//     if (existingReversal) {
//       await t.rollback();
//       return res.status(200).json({
//       success: true,
//       message: "Transfer already reversed",
//       reference: reversalReference
//     });
//   }
    
        
//         // =========================
//         // ONLY SETTLED/COMPLETED
//         // CAN BE REVERSED
//         // =========================
   
//            // VALID REVERSAL STATES
        
//          if (transfer.status === 'REVERSED') {

//           await t.rollback();

//              return res.status(409).json({
//              error: 'Transfer already reversed'
//            });

//           }

//         if (
//             transfer.status !== 'SETTLED' &&
//             transfer.status !== 'COMPLETED'
//           ) {

//             await t.rollback();

//             return res.status(400).json({
//             error:
//            'Only SETTLED or COMPLETED transfers can be reversed'
//           });

//           } 
          

//         // =========================
//         // FIND BANK ACCOUNT
//         // =========================
  
//         const account =
//           await BankAccount.findOne({
  
//             where: {
//               id: transfer.senderAccountId,
//             // userId: req.user.id    // ? Temporarily remove userId filter to allow reversal even if account ownership has changed since transfer execution
//             },
  
//             transaction: t,

//             lock: t.LOCK.UPDATE
//           });
  
//         if (!account) {
  
//           await t.rollback();
  
//           return res.status(404).json({
//             error: 'Bank account not found'
//           });
  
//         }
  
//         const amount = parseFloat(transfer.amount);

//         if (amount <= 0) {
             
//           throw new Error("Invalid reversal amount");
//         }
  
//         // =========================
//         // RESTORE BANK BALANCES
//         // =========================
  
//         const balanceBefore =
//           parseFloat(account.balance);
  
//         const ledgerBefore =
//           parseFloat(account.ledgerBalance);
  
//         const availableBefore =
//           parseFloat(account.availableBalance);
  
//         const balanceAfter =
//           balanceBefore + amount;
  
//         const ledgerAfter =
//           ledgerBefore + amount;
  
//         const availableAfter =
//           availableBefore + amount;
  
//         await account.update({
  
//           balance:
//             balanceAfter,
  
//           ledgerBalance:
//             ledgerAfter,
  
//           availableBalance:
//             availableAfter
  
//         }, {
  
//           transaction: t
  
//         });
  
//         // =========================
//         // FIND LEDGER ACCOUNTS
//         // =========================
  
//         const customerLedger =
//           await LedgerAccount.findOne({
  
//             where: {
//               userId: req.user.id,
//               accountType: 'CUSTOMER'
//             },
  
//             transaction: t,

//             lock: t.LOCK.UPDATE
//           });
  
//         if (!customerLedger) {
  
//           await t.rollback();
  
//           return res.status(404).json({
//             error: 'Customer ledger not found'
//           });
  
//         }
  
//         const systemLedger =
//           await LedgerAccount.findOne({
  
//             where: {
//               accountType: 'SYSTEM_CLEARING'
//             },
  
//             transaction: t,

//             lock: t.LOCK.UPDATE
//           });
  
//         if (!systemLedger) {
  
//           await t.rollback();
  
//           return res.status(404).json({
//             error: 'System ledger not found'
//           });
  
//         }

//         // =========================
//         // VALIDATE REVERSAL LEDGER ENTRIES
//         // =========================

//         await validateLedger({

//           t,
        
//           reference: reversalReference,
        
//           currency:
//             account.currency,
        
//           debitEntries: [
//             {
//               amount,
//               currency: 
//                 account.currency
//             }
//           ],
        
//           creditEntries: [
//             {
//               amount,
//               currency:
//                 account.currency
//             }
//           ]
        
//         });


//         // =========================
//         // POST REVERSAL TRANSACTIONS (ATOMIC)
//         // =========================
//         await postTransaction({
//           t,
//           fromAccount: systemLedger,
//           toAccount: customerLedger,
//           amount,
//           currency: account.currency,
//           reference: ledgerReference,   // 👈 UNIQUE PER OPERATION
//           description: 'Transfer reversal',
//           transferId: transfer.id
//         });

//            // Replaced by  postTransaction above to ensure atomicity and proper validation
//         // // =========================
//         // // COMPENSATING LEDGER ENTRIES
//         // // =========================
  
//         // // CUSTOMER GETS CREDIT BACK
  
//         // await LedgerEntry.create({
  
//         //   ledgerAccountId:
//         //     customerLedger.id,

//         //   transferId:
//         //     transfer.id,
  
//         //   reference: 
//         //     reversalReference,
  
//         //   type:
//         //     'CREDIT',
  
//         //   amount:
//         //     reversalAmount,
  
//         //   currency:
//         //     account.currency,
  
//         //   description:
//         //     'Transfer reversal'
  
//         // }, {
  
//         //   transaction: t
  
//         // });


//            // Replaced by  postTransaction above to ensure atomicity and proper validation
//         // // SYSTEM CLEARING LOSES FUNDS
  
//         // await LedgerEntry.create({
  
//         //   ledgerAccountId:
//         //     systemLedger.id,

//         //   transferId:
//         //     transfer.id,
  
//         //   reference: 
//         //     reversalReference,
  
//         //   type:
//         //     'DEBIT',
  
//         //   amount:
//         //     reversalAmount,
  
//         //   currency:
//         //     account.currency,
  
//         //   description:
//         //     'Transfer reversal settlement'
  
//         // }, {
  
//         //   transaction: t
  
//         // });

  
//         // // =========================
//         // // UPDATE LEDGER BALANCES
//         // // =========================
  
//         // await customerLedger.update({
  
//         //   balance:
//         //     parseFloat(customerLedger.balance) + amount
  
//         // }, {
  
//         //   transaction: t
  
//         // });
  
//         // await systemLedger.update({
  
//         //   balance:
//         //     parseFloat(systemLedger.balance) - amount
  
//         // }, {
  
//         //   transaction: t
  
//         // });

//         // if (systemLedger.balance - amount < 0) {
//         //   throw new Error("System clearing underflow blocked");
//         // }
  
//         // =========================
//         // TRANSACTION JOURNAL
//         // =========================
  
//         await Transaction.create({
  
//           bankAccountId:
//             account.id,
  
//           reference: reversalReference,
  
//           type:
//             'REVERSAL',
  
//           direction:
//             'CREDIT',
  
//             amount,
  
//           currency:
//             account.currency,
  
//           description:
//             'Transfer reversed',
  
//           status:
//             'COMPLETED',
  
//           balanceBefore:
//             availableBefore,
  
//           balanceAfter:
//             availableAfter
  
//         }, {
  
//           transaction: t
  
//         });



//         // =========================
//         // VALIDATE FINAL LEDGER STATE
//         // =========================
//         await validateLedger({

//           t,
        
//           reference: reversalReference, // group reference still same
        
//           debitEntries: [
//             {
//               amount,
//               currency: account.currency,
//                 reference: debitRef
//             }
//           ],
        
//           creditEntries: [
//             {
//               amount,
//               currency: account.currency,
//               reference: creditRef
//             }
//           ]
        
//         });


  
//         // =========================
//         // UPDATE TRANSFER STATUS
//         // =========================
  
//         await transfer.update(
//           { status: 'REVERSED' 

//           }, { 
//              transaction: t 
//             }
//           );
  
//         // =========================
//         // COMMIT
//         // =========================

//         await t.commit();

//         if (req.idempotencyRecord) {

//         await req.idempotencyRecord.update({
//         status: 'COMPLETED',
//         response: {
//         success: true,
//         transferId: transfer.id,
//        }

//     });

//   }

//   return res.json({
//      success: true,
//      message:
//         'Transfer reversed successfully',
//      transfer
//   });
  
//       } catch (err) {
  
//         await t.rollback();
  
//           // console.error(err);
//           console.error("REVERSE ERROR FULL:", err);
//           console.error("STACK:", err?.stack);


//         if (req.idempotencyRecord) {

//           // await req.idempotencyRecord.destroy();
//           await req.idempotencyRecord.update({
//             status: 'FAILED',
//             retryCount: 
//               (req.idempotencyRecord.retryCount || 0) + 1,
//             response: {
//               error: 'Transfer reversal failed'
//             }

//           });
        
//         }
  
//         return res.status(500).json({
//           error: err.message // Only for debugging, remove later - in production, return a generic message to avoid leaking internal details
//           // error: err.message || 'Transfer reversal failed'
  
//           // error:
//           //    'Reversal failed'
  
//         });
  
//       }
  
//     }
//   );


  router.post(
    '/cancel/:id',
    combinedAuth,
    async (req, res) => {
  
      const sequelize = BankAccount.sequelize;
      const t = await sequelize.transaction({
        isolationLevel: 
        // Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
        Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
      });
  
      try {
  
        const transfer =
          await Transfer.findOne({
  
            where: {
              id: req.params.id,
              userId: req.user.id
            },

            lock: t.LOCK.UPDATE,

            transaction: t

            // lock: t.LOCK.UPDATE

          });
  
        if (!transfer) {
  
          await t.rollback();
  
          return res.status(404).json({
            error: 'Transfer not found'
          });
  
        }
  
        if (
          transfer.status !== 'PENDING' &&
          transfer.status !== 'AUTHORIZED'
        ) {
  
          await t.rollback();
  
          return res.status(400).json({
            error:
              'Only PENDING or AUTHORIZED transfers can be cancelled'
          });
  
        }
  
        const account =
          await BankAccount.findByPk(
            transfer.senderAccountId,
            {

              lock: t.LOCK.UPDATE,

              transaction: t

              // lock: t.LOCK.UPDATE

            }
          );
  
        if (!account) {
  
          await t.rollback();
  
          return res.status(404).json({
            error: 'Account not found'
          });
  
        }
  
        const amount =
          parseFloat(transfer.amount);
  
        const availableBefore =
          parseFloat(account.availableBalance);
  
        const pendingBefore =
          parseFloat(account.pendingBalance);
  
        const availableAfter =
          availableBefore + amount;
  
        const pendingAfter =
          pendingBefore - amount;
  
        await account.update({
  
          availableBalance:
            availableAfter,
  
          pendingBalance:
            pendingAfter
  
        }, {
  
          transaction: t
  
        });
  
        await transfer.update({
  
          status: 'CANCELLED'
  
        }, {
  
          transaction: t
  
        });
  
        await Transaction.create({
  
          bankAccountId:
            account.id,
  
          reference:
            transfer.reference,
  
          type: 'REVERSAL',
  
          direction: 'CREDIT',
  
          amount,
  
          currency:
            account.currency,
  
          description:
            'Transfer cancelled',
  
          status: 'COMPLETED',
  
          balanceBefore:
            availableBefore,
  
          balanceAfter:
            availableAfter
  
        }, {
  
          transaction: t
  
        });
  
        await t.commit();
  
        return res.json({
  
          success: true,
          transfer
  
        });
  
      } catch (err) {
  
        await t.rollback();
  
        console.error(err);
  
        return res.status(500).json({
  
          error:
            'Cancellation failed'
  
        });
  
      }
  
    }
  );



  // =========================
// DAILY RECONCILIATION
// =========================

router.get(
  '/reconcile',
  combinedAuth,
  async (req, res) => {

    try {

      const report =
        await runDailyReconciliation();

      return res.json(report);

    } catch (err) {

      console.error(err);

      return res.status(500).json({

        error:
          'Reconciliation failed'

      });

    }

  }
);


  module.exports = router;








  


 