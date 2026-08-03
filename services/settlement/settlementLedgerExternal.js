// services/settlement/settlementLedgerExternal.js

const { postTransaction } = require('../ledger/postTransaction');
const { postFXTransaction } = require('../ledger/postFXTransaction');
const { getTreasuryAccount } = require('../treasury/treasuryService');
const loadCorrespondentLedger = require('../settlement/loadCorrespondentLedger');

async function settlementLedger({

    customerLedger,
    systemLedger,
    beneficiaryLedger,
    transfer,
    beneficiaryCredit,
    transaction,
    rebuildMode = false

}) {

    const settlementReference =
        `${transfer.reference}-SETTLEMENT`;

    const requiresFX =
        transfer.sourceCurrency !==
        transfer.destinationCurrency;

    // ==================================================
    // DOMESTIC SETTLEMENT
    // ==================================================

    if (!requiresFX) {

        await postTransaction({

            t: transaction,

            transferId: transfer.id,

            fromAccount: customerLedger,

            toAccount: systemLedger,

            amount: Number(transfer.amount),

            currency: transfer.sourceCurrency,

            reference: settlementReference,

            description: 'Transfer settlement',

            rebuildMode

        });

        await postTransaction({

            t: transaction,

            transferId: transfer.id,

            fromAccount: systemLedger,

            toAccount: beneficiaryLedger,

            amount: Number(beneficiaryCredit),

            currency: transfer.destinationCurrency,

            reference: settlementReference,

            description: 'Beneficiary settlement',

            rebuildMode

        });

        return;
    }



    // ==================================================
    // FX SETTLEMENT
    // ==================================================

    const treasurySource =
        await getTreasuryAccount(

            transfer.sourceCurrency,

            transaction

        );

    const treasuryDestination =
        await getTreasuryAccount(

            transfer.destinationCurrency,

            transaction

        );

    const correspondentLedger =
        await loadCorrespondentLedger(

             transfer.destinationCurrency,

             transaction

            );


    console.log(

        '[FX SETTLEMENT]',

        transfer.sourceCurrency,

        '->',

        transfer.destinationCurrency

    );

    // ---------------------------------------------
    // 1. Customer -> Treasury (EUR)
    // ---------------------------------------------

    await postTransaction({

        t: transaction,

        transferId: transfer.id,

        fromAccount: customerLedger,

        toAccount: treasurySource,

        amount: Number(transfer.amount),

        currency: transfer.sourceCurrency,

        reference: settlementReference,

        description: 'Customer sold source currency',

        rebuildMode

    });


    // --------------------------------------------------
    // 2. Treasury EUR -> Treasury USD
    // --------------------------------------------------
    await postFXTransaction({

        t: transaction,

        transferId: transfer.id,

        fromAccount: treasurySource,

        toAccount: treasuryDestination,

        sourceAmount: Number(transfer.amount),

        sourceCurrency: transfer.sourceCurrency,

        destinationAmount: Number(beneficiaryCredit),

        destinationCurrency: transfer.destinationCurrency,

        exchangeRate: Number(transfer.exchangeRate),

        reference: settlementReference,

        description: 'Treasury FX conversion',

        rebuildMode

    });


    // // ---------------------------------------------
    // // Treasury USD -> Beneficiary
    // // ---------------------------------------------

    await postTransaction({

        t: transaction,
    
        transferId: transfer.id,
    
        fromAccount: treasuryDestination,
    
        toAccount: correspondentLedger,
    
        amount: Number(beneficiaryCredit),
    
        currency: transfer.destinationCurrency,
    
        reference: settlementReference,
    
        description: 'Funds sent to correspondent bank',
    
        rebuildMode
    
    });

    console.log(
        '[EXTERNAL SWIFT]',
        {
            treasury: treasuryDestination.id,
            correspondent: correspondentLedger.id,
            amount: beneficiaryCredit,
            currency: transfer.destinationCurrency
        }
    );

     // console.log(
    //     '[EXTERNAL SWIFT]',
    //     'Funds leave treasury toward correspondent bank'
    // );

    return {
        debitAccountId: treasuryDestination.id,
        creditAccountId: correspondentLedger.id,
        beneficiaryType: 'EXTERNAL'
    };

}



module.exports = settlementLedger;