// services/ledger/balanceProjection.js

const { LedgerAccount, LedgerEntry } = require('../../models');
const { Sequelize } = require('sequelize');

async function rebuildLedgerBalances(transaction = null) {

    console.log('[BALANCE PROJECTION] Rebuilding ledger balances...');

    // Reset all cached balances
    await LedgerAccount.update(
        { balance: 0 },
        {
            where: {},
            transaction
        }
    );

    // Aggregate ledger entries
    const projectedBalances = await LedgerEntry.findAll({

        attributes: [

            'ledgerAccountId',

            [
                Sequelize.literal(`
                    SUM(
                        CASE
                            WHEN type='CREDIT'
                                THEN amount
                            ELSE -amount
                        END
                    )
                `),
                'balance'
            ]

        ],

        group: ['ledgerAccountId'],

        raw: true,

        transaction

    });

    // Apply balances
    for (const row of projectedBalances) {

        await LedgerAccount.update(

            {

                balance: parseFloat(row.balance)

            },

            {

                where: {

                    id: row.ledgerAccountId

                },

                transaction

            }

        );

    }

    console.log(
        `[BALANCE PROJECTION] Rebuilt ${projectedBalances.length} ledger balances`
    );
    
    return projectedBalances.length;
}

module.exports = {

    rebuildLedgerBalances

};