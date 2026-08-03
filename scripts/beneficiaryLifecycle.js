// scripts/testBeneficiary.js

const {
    sequelize,
    User
} = require('../models');

const PERSIST_TEST_DATA = false;

const createBeneficiary =
    require('../services/beneficiary/createBeneficiary');

const verifyBeneficiary =
             require('../services/beneficiary/verifyBeneficiary');

const createBeneficiaryLedgerEvent =
    require('../services/beneficiary/createBeneficiaryLedgerEvent');

const activateBeneficiary =
    require('../services/beneficiary/activateBeneficiary');


(async () => {

    const t = await sequelize.transaction();

    try {

        const user =
            await User.findByPk(21, {

                transaction: t

            });

        const beneficiary =
            await createBeneficiary({

                user,

                beneficiaryData: {

                    bankAccountId: 3,

                    beneficiaryName:
                        'John Test Beneficiary',

                    iban:
                        'FR7612345678901234567890123',

                    bic:
                        'BNPAFRPP',

                    bankName:
                        'BNP PARIBAS',

                    country:
                        'FR',

                    currency:
                        'EUR',

                    transferNetwork:
                        'SEPA'

                },

                transaction: t

            });


        console.log(
            'Beneficiary created:',
            beneficiary.id,
            beneficiary.status,
            beneficiary.isVerified
        );



        const verifiedBeneficiary =
            await verifyBeneficiary({

            beneficiary,

            transaction: t

        });

        console.log(

            'Returned:',

            verifiedBeneficiary.status,

            verifiedBeneficiary.isVerified
        );

        console.log(
            'Original:',
            beneficiary.status,
            beneficiary.isVerified
        );

        // const event =
        const beneficiaryVerifiedEvent =
            await createBeneficiaryLedgerEvent({

                transaction: t,

                beneficiary,

                eventType:
                    'BENEFICIARY_VERIFIED'

            });

        console.log(
            'Ledger Event:',
            event.event.eventType
        );

        console.log(
            'Payload:',
            event.event.payload
        );

        console.log(
            'Idempotency Key:',
            event.event.idempotencyKey
        );

        console.log(
            '✔ Beneficiary test passed.'
        );



        const activatedBeneficiary =
            await activateBeneficiary({

                beneficiary,

                transaction: t

            });

        console.log(
            'Activated:',

            activatedBeneficiary.status,

            activatedBeneficiary.isVerified
        );


        // const activationEvent =
           const beneficiaryActivatedEvent =
            await createBeneficiaryLedgerEvent({

                transaction: t,

                beneficiary,

                eventType:
                    'BENEFICIARY_ACTIVATED'

            });

        console.log(
            'Ledger Event:',
            activationEvent.event.eventType
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









// // scripts/testBeneficiary.js

// const { sequelize, User } = require('../models');

// const createBeneficiary =
// require('../services/beneficiary/createBeneficiary');

// const { createWelcomeLedgerEvent } = 
// require('../services/beneficiary/createBeneficiaryLedgerEvent');

// (async () => {

//     const t = await sequelize.transaction();

//     try {
    
//             const user =
//                 await User.findByPk(21, {
    
//                     transaction: t
    
//                 });
    
//             const beneficiaryData = {
//                 bankAccountId: 3,
//                 beneficiaryName: 'John Doe',
//                 iban: 'FR7612345678901234567890123',
//                 bic: 'BNPAFRPP',
//                 bankName: 'BNP PARIBAS',
//                 country: 'FR',
//                 currency: 'EUR',
//                 transferNetwork: 'SEPA'
//             };
    
//             const beneficiary =
//                 await createBeneficiary({
    
//                     user,
//                     beneficiaryData,
//                     transaction: t
    
//                 });
    
//             console.log(
//                 'Beneficiary created:',
//                 beneficiary.id,
//                 // beneficiary.beneficiaryName
//                 beneficiary.status
//             );
    
//             // const ledgerEvent =
//             // await createWelcomeLedgerEvent({
//                const event =
//                 await createBeneficiaryLedgerEvent({
    
    
//                     transaction: t,
    
//                     beneficiary,
    
//                     eventType: 'BENEFICIARY_CREATED'
    
//                 });
    
//             // console.log(
//             //     'Beneficiary Ledger Event created:',
//             //     ledgerEvent.id,
//             //     ledgerEvent.eventType
//             // );
//             console.log(
//                 'Ledger Event:',
//                 event.event.eventType
//             );
    
    
//             await t.commit();
    
//         } catch (error) {

//             console.error('Error creating beneficiary:', error);

//             await t.rollback();

//         }
//     })();
