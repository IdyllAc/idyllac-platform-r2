//services/bankAccounts/freezeAccount.js

async function freezeAccount({

    account

}) {

    account.isFrozen = true;

    await account.save();

    return account;

}

module.exports = freezeAccount;