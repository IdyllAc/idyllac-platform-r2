// services/bankAccounts/setPrimaryAccount.js

const { BankAccount } = require('../../models');

async function setPrimaryAccount({

    account,
    userId

}) {

    await BankAccount.update(

        {

            isPrimary: false

        },

        {

            where: {

                userId

            }

        }

    );

    account.isPrimary = true;

    await account.save();

    return account;

}

module.exports = setPrimaryAccount;