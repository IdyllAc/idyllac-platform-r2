// services/cards/requestCard.js

const {
    User,
    Kyc,
    BankAccount,
    CardRequest
} = require('../../models');

async function requestCard({

    userId,

    cardHolderName,

    currency = 'EUR',

    type = 'VISA',

    level = 'CLASSIC',

    physical = true,

    virtual = false,

    transaction

}) {

    const user = await User.findByPk(

        userId,

        {

            transaction

        }

    );

    if (!user) {

        throw new Error(
            'User not found.'
        );

    }

    //
    // KYC
    //

    const kyc = await Kyc.findOne({

        where: {

            userId: user.id


        },

        transaction

    });

    if (!kyc) {

        throw new Error(
            'Customer has no KYC record.'
        );

    }

    if (kyc.status !== 'APPROVED') {

        throw new Error(
            'Customer KYC is not approved.'
        );

    }

    //
    // Bank Account
    //

    const bankAccount = await BankAccount.findOne({

        where: {

            userId: user.id

        },

        transaction

    });

    if (!bankAccount) {

        throw new Error(
            'Bank account not found.'
        );

    }

    if (bankAccount.status !== 'ACTIVE') {

        throw new Error(
            'Bank account is not active.'
        );

    }

    if (bankAccount.isFrozen) {

        throw new Error(
            'Bank account is frozen.'
        );

    }

    //
    // Existing Request
    //

    const existingRequest = await CardRequest.findOne({

        where: {

            userId: user.id,

            status: 'REQUESTED'

        },

        transaction

    });

    if (existingRequest) {

        throw new Error(
            'A pending card request already exists.'
        );

    }

    //
    // Create Request
    //

    const request = await CardRequest.create({

        userId: user.id,

        bankAccountId: bankAccount.id,

        cardHolderName,

        currency,

        type,

        level,

        physical,

        virtual,

        status: 'REQUESTED',

        requestedAt: new Date()

    }, {

        transaction

    });

    return request;

}

module.exports = requestCard;