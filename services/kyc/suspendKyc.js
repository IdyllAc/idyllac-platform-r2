// services/kyc/suspendKyc.js

async function suspendKyc({

    kyc,

    reviewedBy,

    notes,

    transaction

}) {

    if (kyc.status !== 'APPROVED') {

        throw new Error(
            'Only approved KYC can be suspended.'
        );

    }

    await kyc.update({

        status: 'SUSPENDED',
        // previousStatus:"APPROVED",
        // newStatus:"SUSPENDED",
        // reason:"Compliance hold"

        reviewedBy,

        reviewedAt: new Date(),

        notes

    }, {

        transaction

    });

    return kyc;

}

module.exports = suspendKyc;