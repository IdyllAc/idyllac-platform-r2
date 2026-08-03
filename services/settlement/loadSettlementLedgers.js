// services/settlement/loadSettlementLedgers.js

const { LedgerAccount } = require('../../models');

async function loadSettlementLedgers({

    transfer,
    transaction

}) {


      // =========================
      // REAL DOUBLE-ENTRY LEDGER
      // =========================

      const customerLedger =
        await LedgerAccount.findOne({

          where: {
            userId: transfer.userId,
            accountType: 'CUSTOMER'
          },

          transaction,
          lock: transaction.LOCK.UPDATE

        });

      if (!customerLedger) {

        // await t.rollback();

       throw new Error('Customer ledger not found');

      }


      const systemLedger =
        await LedgerAccount.findOne({

          where: {
            accountType: 'SYSTEM_CLEARING'
          },

          transaction,
          lock: transaction.LOCK.UPDATE

        });

      if (!systemLedger) {

        // await t.rollback();

        throw new Error('System clearing ledger not found');


      }

      return {

        customerLedger,
    
        systemLedger
    
    };

}



      module.exports = loadSettlementLedgers;
