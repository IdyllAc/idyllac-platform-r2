// services/beneficiary/deactivateBeneficiary.js

const {
    Beneficiary
} = require('../../models');

async function deactivateBeneficiary({

    beneficiary,

    transaction

}) {

    await beneficiary.update({

        status: 'DEACTIVATED'

    }, {

        transaction

    });

    return beneficiary;

}

module.exports = deactivateBeneficiary;