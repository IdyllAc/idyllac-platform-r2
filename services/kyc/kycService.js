// services/kyc/kycService.js

const submitKyc =
    require('./submitKyc');

const approveKyc =
    require('./approveKyc');

const rejectKyc =
    require('./rejectKyc');

const suspendKyc =
    require('./suspendKyc');

const createKycLedgerEvent =
    require('./createKycLedgerEvent');

module.exports = {

    submitKyc,

    approveKyc,

    rejectKyc,

    suspendKyc,

    createKycLedgerEvent

};