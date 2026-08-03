// services/ledger/rebuildAllTransfers.js

const {

    Transfer,
    LedgerEntry,
    Transaction

} = require('../../models');

async function rebuildAllTransfers({

    transferId,
    transaction
}) {

const transfers = await Transfer.findAll();

for (const transfer of transfers) {

    await rebuildTransferAccounting({

        transferId: transfer.id,

        transaction

     });

  }

};


module.exports = rebuildAllTransfers




// After that, you'll have an endpoint like

// POST

// /api/transfers/rebuild-ledger

// or

// POST

// /api/transfers/rebuild-ledger/:id

// Then repairing Transfer #7 becomes as simple as

// POST /api/transfers/rebuild-ledger/7

// instead of touching the database manually.