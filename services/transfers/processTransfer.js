// services/transfers/processTransfer.js

const { Sequelize, Transfer, BankAccount } = require('../../models');
const { appendLedgerEvent } = require('../ledger/eventAppender');

async function processTransfer({

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

            throw new Error('Transfer not found');

        }

        if (transfer.status !== 'AUTHORIZED') {

            throw new Error(
                'Only AUTHORIZED transfers can be processed'
            );

        }

        transfer.status = 'PROCESSING';

        await transfer.save({

            transaction: t

        });

        await appendLedgerEvent({

            transaction: t,

            aggregateId: transfer.id,

            eventType: 'TRANSFER_PROCESSING',

            reference: transfer.reference,

            userId,

            payload: {

                status: 'PROCESSING'

            },

            idempotencyKey:
                `transfer-processing-${transfer.id}`

        });

        await t.commit();

        return transfer;

    } catch (err) {

        await t.rollback();

        console.error(err);

        throw err;

    }

}

module.exports = processTransfer;