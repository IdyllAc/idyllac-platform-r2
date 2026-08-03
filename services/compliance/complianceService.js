// services/compliance/complianceService.js

const validateTransferLimits =
    require('./validateTransferLimits');

const freezeCustomer =
    require('./freezeCustomer');

const unfreezeCustomer =
    require('./unfreezeCustomer');

const createComplianceLedgerEvent =
    require('./createComplianceLedgerEvent');

module.exports = {

    validateTransferLimits,

    freezeCustomer,

    unfreezeCustomer,

    createComplianceLedgerEvent

};