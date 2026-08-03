// services/bankAccounts/getAccounts.js

const { BankAccount } = require('../../models');

async function getAccounts({ userId }) {

    return await BankAccount.findAll({

        where: {
            userId
        },

        order: [
            ['createdAt', 'DESC']
        ]

    });

}

module.exports = getAccounts;