// services/onboarding/createCustomerLedger.js

const {
    LedgerAccount
} = require('../../models');

async function createCustomerLedger({

    user,

    bankAccount,

    transaction

}) {

    if (!user) {

        throw new Error(
            'User is required'
        );

    }

    if (!bankAccount) {

        throw new Error(
            'Bank account is required'
        );

    }

    //
    // Prevent duplicate CUSTOMER ledger
    //

    const existingLedger =
        await LedgerAccount.findOne({

            where: {

                userId: user.id,

                accountType: 'CUSTOMER'

            },

            transaction

        });

    if (existingLedger) {

        return existingLedger;

    }

    //
    // Create CUSTOMER ledger
    //

    const ledger =
        await LedgerAccount.create({

            userId: user.id,

            accountType: 'CUSTOMER',

            currency: bankAccount.currency,

            balance: 0

        }, {

            transaction

        });

    return ledger;

}

module.exports =
    createCustomerLedger;