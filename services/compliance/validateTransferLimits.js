// services/compliance/validateTransferLimits.js

const {
    Kyc,
    BankAccount
} = require('../../models');

const DAILY_TRANSFER_LIMIT = 10000;
const MONTHLY_TRANSFER_LIMIT = 50000;

async function validateTransferLimits({

    user,

    amount,

    transaction

}) {

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
            `Transfers are not allowed while KYC status is ${kyc.status}.`
        );

    }

    const account = await BankAccount.findOne({

        where: {

            userId: user.id

        },

        transaction

    });

    if (!account) {

        throw new Error(
            'Customer bank account not found.'
        );

    }

    if (account.isFrozen) {

        throw new Error(
            'Customer account is frozen.'
        );

    }

    /*
        Next versions will calculate:

        daily volume

        monthly volume

        sanctions

        AML

        velocity

        country restrictions

    */

    if (Number(amount) > DAILY_TRANSFER_LIMIT) {

        throw new Error(
            'Daily transfer limit exceeded.'
        );

    }

    return {

        approved: true,

        limits: {

            dailyLimit:
                DAILY_TRANSFER_LIMIT,

            monthlyLimit:
                MONTHLY_TRANSFER_LIMIT

        }

    };

}

module.exports = validateTransferLimits;