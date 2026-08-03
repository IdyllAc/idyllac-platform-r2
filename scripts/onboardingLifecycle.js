// scripts/testOnboarding.js

const { sequelize, User } = require('../models');

const PERSIST_TEST_DATA = false;

const createCustomerBankAccount =
require('../services/onboarding/createCustomerBankAccount');

const createCustomerLedger =
require('../services/onboarding/createCustomerLedger');

const { createWelcomeLedgerEvent } = 
require('../services/onboarding/createWelcomeLedgerEvent');

(async () => {

    const t = await sequelize.transaction();

    try {

        const user =
            await User.findByPk(21, {

                transaction: t

            });

        const bankAccount =
            await createCustomerBankAccount({

                user,

                transaction: t

            });

            console.log(
                'Bank Account created:',
                bankAccount.id,
                bankAccount.currency
            );

        const ledger =
            await createCustomerLedger({

                user,

                bankAccount,

                transaction: t

            });

            console.log(
                'Customer Ledger created:',
                ledger.id,
                ledger.accountType
            );

        const welcomeEvent =
        await createWelcomeLedgerEvent({

            transaction: t,
        
            user,
        
            bankAccount,
        
            customerLedger: ledger
        
        });
        
        console.log(
            'Welcome Ledger Event:',
            welcomeEvent.id,
        );


        console.log(
                '✔ Onboarding test passed.'
            );

       
            
        if (PERSIST_TEST_DATA) {

            await t.commit();
        
            console.log(
                'Transaction committed.'
            );
        
        } else {
        
            await t.rollback();
        
            console.log(
                'Transaction rolled back.'
            );
        
        }

    }

    catch(err){

        console.error(err);

        await t.rollback();

    }

})();