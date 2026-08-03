// services/cards/generateCard.js

const createCardIdentity =
    require('./createCardIdentity');


const {
    Card,
    BankAccount
} = require('../../models');

const generatedAt = new Date();

async function generateCard({

    request,

    transaction

}) {

    //
    // Validate request
    //

    if (!request) {

        throw new Error(
            'Card request is required.'
        );

    }

    if (request.status !== 'APPROVED') {

        throw new Error(
            'Card request must be APPROVED.'
        );

    }

    //
    // Load bank account
    //

    const bankAccount = await BankAccount.findByPk(

        request.bankAccountId,

        {

            transaction

        }

    );

    if (!bankAccount) {

        throw new Error(
            'Bank account not found.'
        );

    }


        const identity =
        createCardIdentity();


    //
    // Create Card
    //

    const card =
        await Card.create({

            userId:
                request.userId,

            bankAccountId:
                request.bankAccountId,

            cardHolderName:
                request.cardHolderName,

            number:
                identity.number,

            maskedNumber:
                identity.maskedNumber,
            last4:
                identity.last4,

            expiryMonth:
                identity.expiryMonth,

            expiryYear:
                identity.expiryYear,

            cvv:
               identity.cvv,

            iban:
                bankAccount.iban,

            bic:
                bankAccount.bic,


            currency:
                request.currency,

            type:
                request.type,

            level:
                request.level,

            physical:
                request.physical,

            virtual:
                request.virtual,

            status:
                'GENERATED',

            generatedAt

        }, {

            transaction

        });

    //
    // Update Request
    //

    await request.update({

        status:
            'GENERATED',
            
        generatedAt

    }, {

        transaction

    });

    return card;

}

module.exports = generateCard;