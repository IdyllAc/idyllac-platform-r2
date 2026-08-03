// services/bankAccounts/createAccount.js

const { BankAccount } = require('../../models');

async function createAccount({

    userId,
    body
    // accountName,
    // currency,
    // country,
    // type

}) {

    // build IBAN

    // build account number

    // build ledger number

    // create account

    const timestamp = Date.now().toString();

    const account = await BankAccount.create({

        userId,

        accountName: body.accountName,

        currency: body.currency || 'EUR',

        country: body.country || 'FR',

        type: body.type || 'CHECKING',

        iban: `FR76${timestamp.slice(-15)}`,

        bic: 'IDYLFRPP',

        accountNumber: timestamp.slice(-10),

        ledgerAccountNumber: `LGR-${timestamp.slice(-9)}`,

        balance: 0,

        availableBalance: 0,

        ledgerBalance: 0,

        pendingBalance: 0,

        blockedBalance: 0,

        accountCategory: 'PERSONAL',

        isPrimary: false,

        isClosed: false,

        isFrozen: false,

        allowsInternationalTransfers: true,

        dailyTransferLimit: 10000,

        monthlyTransferLimit: 100000,

        status: 'ACTIVE'


    });

    return account;

}

module.exports = createAccount;




// Excellent question. This gets to the difference between refactoring and changing business behavior.

// Why I removed those fields

// I didn't remove them because they aren't important. I removed them because I was illustrating how to move the code into a service. In a real banking application, those fields absolutely belong in the service.

// In fact, I would put all of the account-creation business rules inside services/bankAccounts/createAccount.js, not in the controller.

// So your service should still generate things like:




// return account;

// Notice something important:

// the controller no longer knows how an account is created.
// the service contains all the banking rules.

// That is exactly what we want.

// Could this be improved later?

// Yes.

// Eventually you probably won't want to hard-code:

// bic: 'IDYLFRPP'

// or

// dailyTransferLimit: 10000

// Instead you'll have something like:

// config/
//     banking.js

// or

// config/
//     defaults.js

// Then:

// dailyTransferLimit: BANKING.DEFAULT_DAILY_LIMIT

// Much cleaner.