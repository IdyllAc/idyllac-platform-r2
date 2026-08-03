// services/transfers/settleTransfer.js

const { Sequelize, Transfer, BankAccount } = require('../../models');

const checkTransactionReference = require('../settlement/checkTransactionReference');
const replaySettlement = require('../settlement/replaySettlement');

async function settleTransfer({

    transferId,
    userId

}) {

    const sequelize = BankAccount.sequelize;

    const t = await sequelize.transaction({

    isolationLevel:
        Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE

});


try {

    const transfer = await Transfer.findOne({

        where: {

           id: transferId,
           userId

        },

        lock: t.LOCK.UPDATE,

        transaction: t

    });

    if (!transfer) {

        // await t.rollback();

        throw new Error('Transfer not found');
    }



    console.log("SETTLE STATUS:", transfer.status);

       // =========================
        // IDEMPOTENCY GUARD (CRITICAL)
        // =========================

        // HARD IDENTITY LOCK (IMPORTANT)
        if (transfer.status === 'SETTLED') {

            // await t.rollback();

          throw new Error('Already settled');
        }



        // ONLY PROCESS VALID STATE
        if (transfer.status !== 'PROCESSING') {

        // await t.rollback();  
    
        throw new Error("Only PROCESSING transfers can be settled");

    }

    const senderAccount =
       await BankAccount.findByPk(

    transfer.senderAccountId,

    {

        lock: t.LOCK.UPDATE,

        transaction: t

    }

);

if (!senderAccount) {

    // await t.rollback();

    throw new Error('Bank account not found');

  }


   // =========================
   // BANK ACCOUNT BALANCE FLOW
   // =========================

       senderAccount.pendingBalance =

           Number(senderAccount.pendingBalance)
           - Number(transfer.amount);

       senderAccount.ledgerBalance =

           Number(senderAccount.ledgerBalance)
           - Number(transfer.amount);

       senderAccount.balance =

           Number(senderAccount.balance)
           - Number(transfer.amount);
         

    await senderAccount.save({

        transaction: t
    
    });


    const settlementReference =
         `${transfer.reference}-SETTLEMENT`;

    await checkTransactionReference({

        reference: settlementReference,

        transaction: t

    });



    await replaySettlement({

        transfer,
    
        senderAccount,
    
        transaction: t
    
    });



     // =========================
      // TRANSFER STATE UPDATE
      // =========================
    transfer.status = 'SETTLED';

    await transfer.save({
    
        transaction: t
    
    });



    await t.commit();

    return transfer; 


 } catch (err) {

        await t.rollback();
    
        console.error(err);
    
        throw err;
    
    }

 }


 module.exports = settleTransfer;

