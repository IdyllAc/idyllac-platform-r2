// services/transfers/completeTransfer.js

const { appendLedgerEvent } = require('../ledger/eventAppender');
const { Sequelize, Transfer, BankAccount } = require('../../models');

async function completeTransfer({

    transferId,
    userId



}) {

    const sequelize = BankAccount.sequelize;

    const t = await sequelize.transaction({

    isolationLevel:
        Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE

    });

     // async (t) => {


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
      throw new Error('Transfer not found');

    }



    // =========================
    // ALREADY COMPLETED
    // =========================

    if (transfer.status === 'COMPLETED') {
        throw new Error('Transfer already completed');

      }


    // =========================
    // ONLY SETTLED TRANSFERS
    // CAN BE MARKED SETTLED
    // =========================

      if (transfer.status !== 'SETTLED') {
       throw new Error('Only SETTLED transfers can be completed');

      }


      await appendLedgerEvent({
        transaction: t,
        aggregateId: transfer.id,
        eventType: 'TRANSFER_COMPLETED',
        reference: transfer.reference,
        userId,
        payload: {
          status: 'COMPLETED'
        },
        idempotencyKey: `transfer-completed-${transfer.id}`
      });


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

    return transfer


  } catch (err) {
        
      await t.rollback();

      console.error(err);

      throw err

    }
  };


  module.exports = completeTransfer;



    



