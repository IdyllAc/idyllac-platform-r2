// services/settlement/rebuildSettlementAccounting.js

const replaySettlement = require('./replaySettlement');

async function rebuildSettlementAccounting({

    transfer,

    senderAccount,

    transaction

}) {

      await replaySettlement({

        transfer,

        senderAccount,

        transaction,

        rebuildMode: true

    });

    return {

        repaired: true,

        transferId: transfer.id,

        reference: transfer.reference

    };

}

module.exports =
    rebuildSettlementAccounting;