// services/settlement/checkTransactionReference.js

const { Transaction } = require('../../models');

async function checkTransactionReference({

    reference, 
    transaction

}) {

  
      const existingTransaction = await Transaction.findOne({

         where: { reference },

          transaction,

          lock: transaction.LOCK.UPDATE

        });

      if (existingTransaction) {

        // await transaction.rollback();

        throw new Error('Tansaction already processed');


    }

}


module.exports = checkTransactionReference;



