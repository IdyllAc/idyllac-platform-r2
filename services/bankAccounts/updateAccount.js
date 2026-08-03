// services/bankAccounts/updateAccount.js

async function updateAccount({

    account,
    updates

}) {

    if (updates.accountName !== undefined) {

        account.accountName = updates.accountName;

    }

    if (updates.currency !== undefined) {

        account.currency = updates.currency;

    }

    if (updates.country !== undefined) {

        account.country = updates.country;

    }

    if (updates.type !== undefined) {

        account.type = updates.type;

    }

    if (updates.allowsInternationalTransfers !== undefined) {

        account.allowsInternationalTransfers =
            updates.allowsInternationalTransfers;

    }

    if (updates.dailyTransferLimit !== undefined) {

        account.dailyTransferLimit =
            updates.dailyTransferLimit;

    }

    if (updates.monthlyTransferLimit !== undefined) {

        account.monthlyTransferLimit =
            updates.monthlyTransferLimit;

    }

    await account.save();

    return account;

}

module.exports = updateAccount;