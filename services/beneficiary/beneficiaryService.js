// services/beneficiary/beneficiaryService.js

const createBeneficiary =
    require('./createBeneficiary');

const verifyBeneficiary =
    require('./verifyBeneficiary');

const activateBeneficiary =
    require('./activateBeneficiary');

const deactivateBeneficiary =
    require('./deactivateBeneficiary');

module.exports = {

    createBeneficiary,

    verifyBeneficiary,

    activateBeneficiary,

    deactivateBeneficiary

};