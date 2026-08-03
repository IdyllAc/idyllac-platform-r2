// services/transfers/reverseTransfer.js

const { Sequelize, Transfer, BankAccount } = require('../../models');
const { appendLedgerEvent } = require('../ledger/eventAppender');
const { postTransaction } = require('../ledger/postTransaction');
const validateLedger = require('../ledger/validateLedger');

const loadSettlementLedgers =
    require('../settlement/loadSettlementLedgers');

const checkTransactionReference =
    require('../settlement/checkTransactionReference.js');


async function reverseTransfer({
   
    transferId,
    userId

}) {

        const sequelize = BankAccount.sequelize;
      
        const t = await sequelize.transaction({
          isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        });
      
        try {
      
          // 1. FIND TRANSFER (LOCKED)
          const transfer = await Transfer.findOne({

            where: {

              id: transferId,
              userId

            },

            transaction: t,
            lock: t.LOCK.UPDATE

          });
      
          if (!transfer) {
            throw new Error("Transfer not found");
          }
      
        
          // 2. STATE CHECK
          if (transfer.status === 'REVERSED') {
            throw new Error("Transfer already reversed");
          }
      
          if (!['SETTLED', 'COMPLETED'].includes(transfer.status)) {
           
            throw new Error("Only SETTLED or COMPLETED transfers can be reversed");
          }
      
        
          // 3. IDENTITY / REFERENCE (SOURCE OF TRUTH)
          const reversalReference = `REV-${transfer.reference}`;
          const reversalAmount = parseFloat(transfer.amount);
      

          await checkTransactionReference({
            reference: reversalReference,
            transaction: t
        });
      

          // 5. BANK ACCOUNT
          const account = await BankAccount.findOne({
            where: { id: transfer.senderAccountId },
            transaction: t,
            lock: t.LOCK.UPDATE
          });
      
          if (!account) {
            // await t.rollback();
            throw new Error("Bank account not found" );
          }
      
         
        const {

            customerLedger,
            systemLedger
        
        } = await loadSettlementLedgers({
        
            transfer,
            transaction: t
        
        });
      
        
          // 7. VALIDATE LEDGER SYMMETRY
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
      
         
          // 8. POST REVERSAL (ONLY ONCE)
          // IMPORTANT: USE SAME REFERENCE
          await postTransaction({
            t,
            fromAccount: systemLedger,
            toAccount: customerLedger,
            amount: reversalAmount,
            currency: account.currency,
            reference: reversalReference,
            description: "Transfer reversal",
            // transferId: transfer.id
            transferId: transfer.id
          });
      
       
          // 9. RESTORE BANK BALANCES
          await account.update({
            balance: parseFloat(account.balance) + reversalAmount,
            ledgerBalance: parseFloat(account.ledgerBalance) + reversalAmount,
            availableBalance: parseFloat(account.availableBalance) + reversalAmount
          }, { transaction: t });
    
    
          await appendLedgerEvent({
            
            transaction: t,
            aggregateId: transfer.id,
            eventType: 'TRANSFER_REVERSED',
            reference: reversalReference,
            userId,
            
            payload: {
              debitAccount: systemLedger.id,
              creditAccount: customerLedger.id,
              amount: reversalAmount,
              currency: account.currency,
              originalReference: transfer.reference,
              reversalReference
            },
            idempotencyKey: `transfer-reversed-${transfer.id}`
          });
      
      
 
        // 11. FINAL STATE
        await transfer.update({

            status: 'REVERSED'

          }, { 

            transaction: t 
        }
    );

      

        await t.commit();
      
        

        return transfer;

      
        } catch (err) {

            console.error("REVERSE ERROR:", err);

        await t.rollback();

          throw err;
    
        }
    
      };


      module.exports = reverseTransfer;