// services/cards/cardService.js

const requestCard =
    require('./requestCard');

const generateCard =
    require('./generateCard');

const activateCard =
    require('./activateCard');

const freezeCard =
    require('./freezeCard');

const unfreezeCard =
    require('./unfreezeCard');

const replaceCard =
    require('./replaceCard');

const closeCard =
    require('./closeCard');

const createCardLedgerEvent =
    require('./createCardLedgerEvent');

const createCardRequestLedgerEvent =
    require('./createCardRequestLedgerEvent');

const approveCardRequest =
    require('./approveCardRequest');

module.exports = {

    requestCard,

    generateCard,

    activateCard,

    freezeCard,

    unfreezeCard,

    replaceCard,

    closeCard,

    createCardLedgerEvent,

    createCardRequestLedgerEvent,
    approveCardRequest

};