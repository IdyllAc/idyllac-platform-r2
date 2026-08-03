// services/kyc/submitKyc.js

const {

    Kyc

} = require('../../models');

async function submitKyc({

    user,

    riskScore = 0,

    notes = null,

    transaction

}) {

    return Kyc.create({

        userId: user.id,

        status: 'PENDING',

        submittedAt: new Date(),

        riskScore,

        notes

    }, {

        transaction

    });

}

module.exports = submitKyc;