// services/beneficiary/activateBeneficiary.js

const {
    Beneficiary
} = require('../../models');

async function activateBeneficiary({

    beneficiary,

    transaction

}) {

    if (beneficiary.status !== 'VERIFIED') {

        throw new Error(
            'Beneficiary must be VERIFIED before activation.'
        );

    }

    await beneficiary.update({

        status: 'ACTIVE'

    }, {

        transaction

    });

    return beneficiary;

}

module.exports = activateBeneficiary;