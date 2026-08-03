// services/bankAccounts/unfreezeAccount.js

async function unfreezeAccount({

    account

}) {

    account.isFrozen = false;

    await account.save();

    return account;

}

module.exports = unfreezeAccount;