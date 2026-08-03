// services/bankAccounts/getAccount.js
const { BankAccount } = require('../../models');

async function getAccount({ id, userId }) {

    return await BankAccount.findOne({

        where: {

            id,
            userId

        },
       
    });

}



module.exports = getAccount;



