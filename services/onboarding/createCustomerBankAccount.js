// services/onboarding/createCustomerBankAccount.js

const DEFAULT_CUSTOMER_CURRENCY = 'EUR';


const {
    BankAccount
} = require('../../models');

async function createCustomerBankAccount({

    user,

    transaction

}) {

    if (!user) {

        throw new Error(
            'User is required'
        );

    }

    //
    // Prevent duplicate default account
    //

    const existingAccount =
        await BankAccount.findOne({

            where: {

                userId: user.id,

                   currency: DEFAULT_CUSTOMER_CURRENCY

            },

            transaction

        });

    if (existingAccount) {

        return existingAccount;

    }

    //
    // Create default EUR account
    //

    const bankAccount =
        await BankAccount.create({

            userId: user.id,

            currency: DEFAULT_CUSTOMER_CURRENCY,

            balance: 0,

            availableBalance: 0,

            ledgerBalance: 0,

            pendingBalance: 0,

            status: 'ACTIVE'

        }, {

            transaction

        });

    return bankAccount;

}

module.exports =
    createCustomerBankAccount;