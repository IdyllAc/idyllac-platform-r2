// services/transfers/cancelTransfer.js

const { Sequelize, Transfer, BankAccount } = require('../../models');
const { appendLedgerEvent } = require('../ledger/eventAppender');

async function cancelTransfer({

    transferId,
    userId

}) {

    const sequelize = BankAccount.sequelize;

    const t = await sequelize.transaction({

        isolationLevel:
            Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE

    });

    try {

        // load transfer
        const transfer = await Transfer.findOne({

            where: {
        
                id: transferId,
                userId
        
            },
        
            transaction: t,
            lock: t.LOCK.UPDATE
        
        });

        if (!transfer)
            throw new Error('Transfer not found');

        // validate status
        if (transfer.status !== 'PENDING')
            throw new Error(
                'Only PENDING transfers can be cancelled'
            );

        // append event
        await appendLedgerEvent({

            transaction: t,
        
            aggregateId: transfer.id,
        
            eventType: 'TRANSFER_CANCELLED',
        
            reference: transfer.reference,
        
            userId,
        
            payload: {
        
                status: 'CANCELLED'
        
            },
        
            idempotencyKey:
                `transfer-cancelled-${transfer.id}`
        
        });

        // update status
        await transfer.update({

            status: 'CANCELLED'
        
        }, {
        
            transaction: t
        
        });

        // commit
        await t.commit();

        // return transfer
        return transfer;

        } catch (err) {

        await t.rollback();

        throw err;

    }

}

module.exports = cancelTransfer;