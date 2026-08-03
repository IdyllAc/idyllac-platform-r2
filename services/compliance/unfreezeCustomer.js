// services/compliance/unfreezeCustomer.js

async function unfreezeCustomer({

    account,

    transaction

}) {

    await account.update({

        isFrozen: false

    }, {

        transaction

    });

    return account;

}

module.exports = unfreezeCustomer;