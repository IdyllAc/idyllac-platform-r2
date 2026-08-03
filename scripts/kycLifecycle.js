// scripts/kycLifecycle.js

const {

    sequelize,

    User

} = require('../models');

const PERSIST_TEST_DATA = false;

const submitKyc =
    require('../services/kyc/submitKyc');

const approveKyc =
    require('../services/kyc/approveKyc');

const rejectKyc =
    require('../services/kyc/rejectKyc');

const suspendKyc =
    require('../services/kyc/suspendKyc');

const createKycLedgerEvent =
    require('../services/kyc/createKycLedgerEvent');

(async () => {

    const t = await sequelize.transaction();

    try {

        const user =
            await User.findByPk(21, {

                transaction: t

            });

        const kyc =
            await submitKyc({

                user,

                riskScore: 25,

                notes: 'Initial submission',

                transaction: t

            });

        console.log(

            'Submitted:',

            kyc.id,

            kyc.status

        );

        await createKycLedgerEvent({

            transaction: t,

            kyc,

            eventType: 'KYC_SUBMITTED'

        });

        console.log(

            'Event: KYC_SUBMITTED'

        );

        await approveKyc({

            kyc,

            reviewedBy: 1,

            transaction: t

        });

        console.log(

            'Approved:',

            kyc.status

        );

        await createKycLedgerEvent({

            transaction: t,

            kyc,

            eventType: 'KYC_APPROVED'

        });

        console.log(

            'Event: KYC_APPROVED'

        );

        await suspendKyc({

            kyc,

            reviewedBy: 1,

            notes: 'Compliance hold',

            transaction: t

        });

        console.log(

            'Suspended:',

            kyc.status

        );

        await createKycLedgerEvent({

            transaction: t,

            kyc,

            eventType: 'KYC_SUSPENDED'

        });

        console.log(

            'Event: KYC_SUSPENDED'

        );

        console.log(

            '✔ KYC lifecycle passed.'

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

    catch (err) {

        console.error(err);

        await t.rollback();

    }

})();