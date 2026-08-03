// services/statements/statementService.js

const {
    Transaction,
    BankAccount
} = require('../../models');

const { Op } = require('sequelize');

async function buildStatement({

    accountId,
    fromDate,
    toDate

}) {

    const account =
        await BankAccount.findByPk(accountId);

    if (!account)
        throw new Error(
            'Account not found'
        );

    const transactions =
        await Transaction.findAll({

            where: {

                createdAt: {

                    [Op.between]:
                    [fromDate, toDate]

                }

            },

            order: [['createdAt', 'ASC']]

        });

    let runningBalance =
        Number(account.balance);

    const lines =
        transactions.map(tx => {

            return {

                date:
                    tx.createdAt,

                reference:
                    tx.reference,

                description:
                    tx.description,

                amount:
                    tx.amount,

                currency:
                    tx.currency,

                type:
                    tx.type

            };

        });

    return {

        accountNumber:
            account.accountNumber,

        currency:
            account.currency,

        openingBalance:
            null, // later

        closingBalance:
            account.balance,

        period: {

            from: fromDate,

            to: toDate

        },

        transactions: lines

    };

}

module.exports = {
    buildStatement
};