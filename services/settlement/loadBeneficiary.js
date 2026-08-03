// services/settlement/loadBeneficiary.js

const {

    Beneficiary,
    BankAccount,
    LedgerAccount

} = require('../../models');

async function loadBeneficiary({

    transfer,

    transaction

}) {

    const beneficiary = await Beneficiary.findByPk(

        transfer.beneficiaryId,

        {

            transaction,

            lock: transaction.LOCK.UPDATE

        }

    );

    if (!beneficiary) {

        throw new Error('Beneficiary not found');

    }

    const beneficiaryAccount = await BankAccount.findByPk(

        beneficiary.bankAccountId,

        {

            transaction,

            lock: transaction.LOCK.UPDATE

        }

    );

    if (!beneficiaryAccount) {

        throw new Error('Beneficiary bank account not found');

    }

    let beneficiaryLedger = null;

    if (beneficiary.beneficiaryType === 'INTERNAL') {
        beneficiaryLedger = await LedgerAccount.findOne({

            where: {

                userId: beneficiaryAccount.userId,

                accountType: 'CUSTOMER'

            },

            transaction,

            lock: transaction.LOCK.UPDATE

        });

        if (!beneficiaryLedger) {

            throw new Error('Beneficiary CUSTOMER ledger not found');

        };

    }


    const isInternal =
        beneficiary.beneficiaryType === 'INTERNAL';

    return {

        beneficiary,
        beneficiaryAccount,
        beneficiaryLedger,
        isInternal

    };


}

module.exports = loadBeneficiary;