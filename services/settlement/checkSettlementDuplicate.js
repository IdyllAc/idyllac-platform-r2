// services/settlement/checkSettlementDuplicate.js

const { Transaction } = require('../../models');



async function checkSettlementDuplicate({

    transfer,

    transaction

}) {


      // =========================
      // SETTLEMENT IDEMPOTENCY CHECK
      // =========================
      const settlementReference =
         `${transfer.reference}-SETTLEMENT`;


      // TRANSACTION REFERENCE CHECK
      const existingSettlement =
        await Transaction.findOne({

         where: {
           reference: settlementReference
          },

          transaction,
          lock: transaction.LOCK.UPDATE

        });

      if (existingSettlement) {

        // await transaction.rollback();

        throw new Error('Settlement already processed');


    }

}


module.exports = checkSettlementDuplicate;


         
     
