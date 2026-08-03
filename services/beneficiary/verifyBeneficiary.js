// services/beneficiary/verifyBeneficiary.js

const {
    Beneficiary
} = require('../../models');

async function verifyBeneficiary({

    beneficiary,

    transaction

}) {

    if (beneficiary.status !== 'PENDING') {

        throw new Error(
            'Only pending beneficiaries can be verified.'
        );

    }

    await beneficiary.update({

        status: 'VERIFIED',

        isVerified: true

    }, {

        transaction

    });

    return beneficiary;

}

module.exports = verifyBeneficiary;