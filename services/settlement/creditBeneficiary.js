// services/settlement/creditBeneficiary.js

async function creditBeneficiary({

    beneficiaryAccount,

    transfer,

    transaction

}) {

    //
    // CREDIT BENEFECIARY ACCOUNT
    //

    const beneficiaryCredit =

        Number(transfer.amount) *
        Number(transfer.exchangeRate);

    const beneficiaryBalanceBefore =
        Number(beneficiaryAccount.balance);

    const beneficiaryAvailableBefore =
        Number(beneficiaryAccount.availableBalance);

    const beneficiaryLedgerBefore =
        Number(beneficiaryAccount.ledgerBalance);

    await beneficiaryAccount.update({

        balance:
            beneficiaryBalanceBefore +
            beneficiaryCredit,

        availableBalance:
            beneficiaryAvailableBefore +
            beneficiaryCredit,

        ledgerBalance:
            beneficiaryLedgerBefore +
            beneficiaryCredit

    }, {

        transaction

    });

    return beneficiaryCredit;

}

module.exports = creditBeneficiary;