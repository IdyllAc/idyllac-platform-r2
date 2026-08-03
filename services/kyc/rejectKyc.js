// services/kyc/rejectKyc.js

async function rejectKyc({

    kyc,

    reviewedBy,

    notes,

    transaction

}) {

    if (kyc.status !== 'PENDING') {

        throw new Error(
            'Only pending KYC can be rejected.'
        );

    }

    await kyc.update({

        status: 'REJECTED',

        reviewedBy,

        reviewedAt: new Date(),

        notes

    }, {

        transaction

    });

    return kyc;

}

module.exports = rejectKyc;