// services/kyc/approveKyc.js

async function approveKyc({

    kyc,

    reviewedBy,

    transaction

}) {

    if (kyc.status !== 'PENDING') {

        throw new Error(
            'Only pending KYC can be approved.'
        );

    }

    await kyc.update({

        status: 'APPROVED',
        // previousStatus:"PENDING",
        // newStatus:"APPROVED",
        // reviewedBy:1,
        // riskScore:25

        reviewedBy,

        reviewedAt: new Date()

    }, {

        transaction

    });

    return kyc;

}

module.exports = approveKyc;