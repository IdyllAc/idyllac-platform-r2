// services/transfers/authorizeTransfer.js

const { Sequelize, Transfer, BankAccount } = require('../../models');

const { appendLedgerEvent } =
require('../ledger/eventAppender');

async function authorizeTransfer({

    transferId,
    userId

}) {

    const sequelize = BankAccount.sequelize;

    // return await sequelize.transaction({
        const t = await sequelize.transaction({

        isolationLevel:
            Sequelize.Transaction
                .ISOLATION_LEVELS
                // .REPEATABLE_READ
                .SERIALIZABLE

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
      
            // await t.rollback();     // Like that is simplifying.
      
            throw new Error('Transfer not found');
      
        }

      
        if (transfer.status !== 'PENDING') {
      
            // await t.rollback();           // Like that is better simplifying.
      
            throw new Error('Only PENDING transfers can be authorized');
      
        }


             transfer.status = 'AUTHORIZED';

             await transfer.save({

             transaction: t

             });
            // await transfer.update({
      
            //   status: 'AUTHORIZED'
      
            // }, {
      
            //   transaction: t
      
            // });


            await appendLedgerEvent({
                transaction: t,
                aggregateId: transfer.id,
                eventType: 'TRANSFER_AUTHORIZED',
                reference: transfer.reference,
                userId,
                
                payload: {
                  status: 'AUTHORIZED'
                },
      
                idempotencyKey: `transfer-authorized-${transfer.id}`
                
              });
              
      
            await t.commit();

            return transfer;
      
            
          } catch (err) {
      
           await t.rollback();
      
            console.error(err);
      

             throw err;
      
          }
      
        };

       

module.exports = authorizeTransfer;