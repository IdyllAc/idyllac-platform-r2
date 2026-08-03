// services/settlement/loadCorrespondentLedger.js

const { LedgerAccount } = require('../../models');

async function loadCorrespondentLedger(currency, transaction) {

    const Ledger = await LedgerAccount.findOne({

        where: {

            accountType: 'CORRESPONDENT',

            currency

        },

        transaction,

        lock: transaction.LOCK.UPDATE

    });

    if (!Ledger) {

        throw new Error(
            `Correspondent ledger not found for ${currency}`
        );

    }

    return Ledger;

}

module.exports = loadCorrespondentLedger;