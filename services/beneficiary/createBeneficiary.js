// services/beneficiary/createBeneficiary.js

const {
    Beneficiary
} = require('../../models');

async function createBeneficiary({

    user,

    beneficiaryData,

    transaction

}) {

    const beneficiary =
        await Beneficiary.create({

            userId: user.id,

            bankAccountId:
                beneficiaryData.bankAccountId,

            beneficiaryName:
                beneficiaryData.beneficiaryName,

            iban:
                beneficiaryData.iban,

            bic:
                beneficiaryData.bic,

            bankName:
                beneficiaryData.bankName,

            country:
                beneficiaryData.country,

            currency:
                beneficiaryData.currency,

            transferNetwork:
                beneficiaryData.transferNetwork,

            status: 'PENDING',

            isVerified: false,

            isFavorite: false,

            riskScore: 0

        }, {

            transaction

        });

    return beneficiary;

}

module.exports = createBeneficiary;