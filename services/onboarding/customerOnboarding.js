// services/onboarding/customerOnboarding.js

const createCustomerBankAccount =
require('./createCustomerBankAccount');

const createCustomerLedger =
require('./createCustomerLedger');

const createWelcomeLedgerEvent =
require('./createWelcomeLedgerEvent');


async function customerOnboarding({

    user,

    transaction

}) {

    //
    // Create default account
    //

    const bankAccount =
        await createCustomerBankAccount({

            user,

            transaction

        });

    //
    // CUSTOMER ledger
    //

    const ledger =
        await createCustomerLedger({

            user,

            bankAccount,

            transaction

        });

    //
    // Welcome event
    //

    await createWelcomeLedgerEvent({

        user,

        ledger,

        transaction

    });

    return {

        bankAccount,

        ledger

    };

}

module.exports =
    customerOnboarding;