// services/compliance/freezeCustomer.js

async function freezeCustomer({

    account,

    transaction

}) {

    await account.update({

        isFrozen: true

    }, {

        transaction

    });

    return account;

}

module.exports = freezeCustomer;