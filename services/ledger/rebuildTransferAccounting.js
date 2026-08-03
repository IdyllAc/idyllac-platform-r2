// services/ledger/rebuildTransferAccounting.js

const {
    Transfer,
    BankAccount,
    LedgerEntry,
    Transaction,
    LedgerEventStream
} = require('../../models');

const rebuildSettlementAccounting =
    require('../settlement/rebuildSettlementAccounting');


async function rebuildTransferAccounting({

    transferId,

    transaction

}) {

    // ====================================
    // LOAD TRANSFER
    // ====================================

    const transfer = await Transfer.findByPk(transferId, {

        transaction,

        lock: transaction.LOCK.UPDATE

    });

    if (!transfer) {

        throw new Error('Transfer not found');

    }

    // ====================================
    // LOAD SENDER ACCOUNT
    // ====================================

    const senderAccount = await BankAccount.findByPk(

        transfer.senderAccountId,

        {

            transaction,

            lock: transaction.LOCK.UPDATE

        }

    );

    if (!senderAccount) {

        throw new Error('Sender account not found');

    }

    // ====================================
    // DELETE OLD ACCOUNTING
    // ====================================

    await LedgerEntry.destroy({

        where: {

            transferId

        },

        transaction

    });

    await Transaction.destroy({

        where: {

            transferId

        },

        transaction

    });

    await LedgerEventStream.destroy({

        where: {

            aggregateId: transferId,

            eventType: 'TRANSFER_SETTLED'

        },

        transaction

    });

    // ====================================
    // REBUILD SETTLEMENT ACCOUNTING
    // ====================================

    await rebuildSettlementAccounting({

        transfer,
    
        senderAccount,
    
        transaction
    
    });


    // -----------------------------------
// VERIFY WHAT WAS REBUILT
// -----------------------------------

const ledgerEntries = await LedgerEntry.count({

    where: {

        transferId

    },

    transaction

});

const transactions = await Transaction.count({

    where: {

        transferId

    },

    transaction

});

return {

    repaired: true,

    transferId,

    reference: transfer.reference,

    ledgerEntries,

    transactions

};
   
    // // ====================================
    // // DONE
    // // ====================================

    // return {

    //     repaired: true,

    //     transferId,

    //     reference: transfer.reference

    // };

}

module.exports = rebuildTransferAccounting;




// Step 4

// Create a controller endpoint such as:

// POST /api/admin/rebuild-transfer/:id

// or

// POST /api/admin/reconcile/repair/:id

// Then running

// repair transfer 7

// will permanently fix your historical data.