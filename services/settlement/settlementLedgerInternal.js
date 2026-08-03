// services/settlement/settlementLedgerInternal.js

const { postTransaction } =
require('../ledger/postTransaction');

async function settlementLedgerInternal({

    customerLedger,

    beneficiaryLedger,

    transfer,

    beneficiaryCredit,

    transaction,

    rebuildMode = false

}) {

    const settlementReference =
        `${transfer.reference}-SETTLEMENT`;

    await postTransaction({

        t: transaction,

        transferId: transfer.id,

        fromAccount: customerLedger,

        toAccount: beneficiaryLedger,

        amount: Number(beneficiaryCredit),

        currency: transfer.destinationCurrency,

        reference: settlementReference,

        description: 'Internal transfer settlement',

        rebuildMode

    });

    return {
        debitAccountId: systemLedger.id,
        creditAccountId: beneficiaryLedger.id,
        beneficiaryType: 'INTERNAL'
    };

}

module.exports =
    settlementLedgerInternal;