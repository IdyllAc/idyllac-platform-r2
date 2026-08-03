// generateLedgerAccountNumbers.js

const {
    sequelize,
    BankAccount
} = require('../models');

(async()=>{

    const t =
        await sequelize.transaction();

    try{

        const accounts =
            await BankAccount.findAll({

                transaction:t

            });

        for(const account of accounts){

            if(account.ledgerAccountNumber){

                continue;

            }

            await account.update({

                ledgerAccountNumber:
                    `LGR-${String(account.id).padStart(9,'0')}`

            },{

                transaction:t

            });

            console.log(

                account.id,

                account.ledgerAccountNumber

            );

        }

        await t.commit();

        console.log(
            'Finished.'
        );

    }

    catch(err){

        console.error(err);

        await t.rollback();

    }

})();