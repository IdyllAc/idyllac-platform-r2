// services/bankAccounts/closeAccount.js
async function closeAccount({

    account

}) {

    account.status = 'CLOSED';

    account.isClosed = true;

    account.closedAt = new Date();

    await account.save();

    return account

}

module.exports = closeAccount;



