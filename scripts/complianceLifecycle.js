// scripts/complianceLifecycle.js

const {
    sequelize,
    User,
    BankAccount
} = require('../models');

const PERSIST_TEST_DATA = false;

const validateTransferLimits =
    require('../services/compliance/validateTransferLimits');

const freezeCustomer =
    require('../services/compliance/freezeCustomer');

const unfreezeCustomer =
    require('../services/compliance/unfreezeCustomer');

const createComplianceLedgerEvent =
    require('../services/compliance/createComplianceLedgerEvent');

(async () => {

    const t = await sequelize.transaction();

    try {

        const user =
            await User.findByPk(21, {

                transaction: t

            });

        const account =
            await BankAccount.findOne({

                where: {

                    userId: user.id

                },

                transaction: t

            });

        const limits =
            await validateTransferLimits({

                user,

                amount: 500,

                transaction: t

            });

        console.log(
            'Transfer validation:',
            limits.approved
        );

        await freezeCustomer({

            account,

            transaction: t

        });

        console.log(
            'Frozen:',
            account.isFrozen
        );

        const frozenEvent =
            await createComplianceLedgerEvent({

                transaction: t,

                account,

                eventType:
                    'COMPLIANCE_FROZEN'

            });

        console.log(
            frozenEvent.event.eventType
        );

        await unfreezeCustomer({

            account,

            transaction: t

        });

        console.log(
            'Unfrozen:',
            account.isFrozen
        );

        const unfrozenEvent =
            await createComplianceLedgerEvent({

                transaction: t,

                account,

                eventType:
                    'COMPLIANCE_UNFROZEN'

            });

        console.log(
            unfrozenEvent.event.eventType
        );

        console.log(
            '✔ Compliance lifecycle passed.'
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