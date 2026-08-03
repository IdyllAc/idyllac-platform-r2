// services/transfers/requestTransfer.js

const { appendLedgerEvent } = require('../ledger/eventAppender');
const convertAmount = require('../fx/convertAmount');
const fxProvider = require('../fx/fxProvider');
const { calculateFee } = require('../fees/calculateFee');

const {
    Sequelize,
    Transfer,
    // Transaction,
    BankAccount,
    Beneficiary,
    // ledgerAccount
} = require('../../models');


async function requestTransfer({

    user,
    body,
    idempotencyRecord

}) {

    const sequelize = BankAccount.sequelize;

    const t = await sequelize.transaction({
    // return await sequelize.transaction({

      isolationLevel: 
          Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE
    });
    
    // async (t) => {
  
    try {

      const {
        senderAccountId,
        beneficiaryId,
        amount,
        description
      } = body;
  
  
      console.log("senderAccountId:",senderAccountId);
      console.log("userId:", user.id);
  
  
      const senderAccount = await BankAccount.findOne({

        where: {

          id: senderAccountId,

          userId: user.id

        },

        lock: t.LOCK.UPDATE,

        transaction: t,
  
      });
  
      if (!senderAccount) {

        await t.rollback();

        throw new Error('Sender account not found');
        // return res.status(404).json({ error: 'Sender account not found' });
      }
  
  
      const beneficiary = await Beneficiary.findOne({
  
         where: {
  
            id: beneficiaryId,
  
            userId: user.id
  
       },
  
       transaction: t
  
     });  
  
      if (!beneficiary) {

        await t.rollback();

        throw new Error('Beneficiary not found');
      }
  
      if (!beneficiary.isVerified) {
  
        await t.rollback();
      
        throw new Error('Beneficiary is not verified');
      
      }
      
      if (
        beneficiary.status === 'BLOCKED'
      ) {
      
        await t.rollback();

        throw new Error('Beneficiary is blocked');
        // return res.status(403).json({
        //   error:
        //     'Beneficiary is blocked'         
        //  });
      }
  
      const parsedAmount = Number(amount);

      if (!parsedAmount || parsedAmount <= 0) {

        await t.rollback();

        throw new Error('Invalid amount');
        // return res.status(400).json({ error: 'Insufficient balance' });

      }
  
      if (Number(senderAccount.availableBalance) < parsedAmount) {

        await t.rollback();
        throw new Error('Insufficient balance');

      }
  
      const recipientCurrency = beneficiary.currency;
  
      const requiresFX =
        senderAccount.currency !== recipientCurrency;
       
        const transferType =
          beneficiary.transferNetwork;
  
  
        console.log('transferType:', transferType);
        
  
        const feeAmount = calculateFee({ 

            transferType,   

            amount: parsedAmount, 

            requiresFX 

          });
  
  
          
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
  
  
      const transfer = await Transfer.create({
  
        userId: user.id,
  
        senderAccountId,
  
        beneficiaryId,
  
     // reference: 'TRF-' + Date.now(),
     // reference: `TRF-${uuidv4()}`,  // Use UUID for better uniqueness
        reference: `TRF-${Date.now()}`,
     // reference,
     
        transferType,
     // transferType: beneficiary.transferNetwork,
     
  
        direction: 'OUTBOUND',
  
        amount: parsedAmount,
  
     // feeAmount: 0,
     // feeAmount: '0.00',
        feeAmount,
  
     // fxRate: fx.rate,
        exchangeRate: fx.rate,
  
        sourceCurrency: senderAccount.currency,
  
     // destinationCurrency: beneficiary.currency,
        destinationCurrency: recipientCurrency,
  
        description,
  
        status: 'PENDING'
  
      }, 
      
      { transaction: t });
  
  
      await senderAccount.update({     //commiitted supposed

        availableBalance: 
           Number(senderAccount.availableBalance) - parsedAmount,
  
        pendingBalance: 
           Number(senderAccount.pendingBalance) + parsedAmount
      }, 
      
      { transaction: t });
  
  
  
      await appendLedgerEvent({
  
        transaction: t,
      
        aggregateId: transfer.id,
      
        eventType: 'TRANSFER_CREATED',
      
        reference: transfer.reference,
      
        userId: user.id,

      
        payload: {

          transferId: transfer.id,

          amount: transfer.amount,

          senderAccountId: transfer.senderAccountId,

          beneficiaryId: transfer.beneficiaryId,

          status: 'PENDING'

        },
        
        idempotencyKey: `transfer-created-${transfer.id}`
      
      });
  
  
      await t.commit();
  
       // SUCCESS → COMPLETE
      if (idempotencyRecord) {
      
        await idempotencyRecord.update({

          status: 'COMPLETED',

          response: {

            success: true,

            transferId: transfer.id,

          }
      
        });
      
      }
      
      return transfer;
      // return res.status(201).json({
      //   success: true,
      //    message: 
      //        'Transfer created successfully',
      //    transfer
      //  });

  
    } catch (err) {
  
      await t.rollback();
  
      console.error(err);
  
        // FAILURE → FAILED
      if (idempotencyRecord) {

        // await idempotencyRecord.destroy();
        await idempotencyRecord.update({

          status: 'FAILED',

          retryCount: (idempotencyRecord.retryCount || 0) + 1,
  
          response: {
            error: 'Transfer creation failed'
          }
  
        });
      
      }
  
      throw new Error('Transfer creation failed');
      // return res.status(500).json({ 
      //   error: 'Transfer creation failed'
      //     });
  
        }
    
      };



      module.exports = requestTransfer;

