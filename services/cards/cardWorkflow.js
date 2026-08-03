// services/cards/cardWorkflow.js

const requestCard = require('./requestCard');
const approveCardRequest = require('./approveCardRequest');
const generateCard = require('./generateCard');

const createCardRequestLedgerEvent =
    require('./createCardRequestLedgerEvent');

const createCardLedgerEvent =
    require('./createCardLedgerEvent');


async function requestAndGenerateCard({

    userId,

    cardHolderName,

    transaction

}) {

    //
    // Request
    //

    let request = await requestCard({

            userId,

            cardHolderName,

            transaction

        });


        await createCardRequestLedgerEvent({

            transaction,
    
            request,
    
            eventType: 'CARD_REQUESTED'
    
        });
    

    //
    // Approve
    //

    request = await approveCardRequest({

            request,

            transaction

        });


        await createCardRequestLedgerEvent({

            transaction,
    
            request,
    
            eventType: 'CARD_APPROVED'
    
        });
    
    

    //
    // Generate
    //

    const card = await generateCard({

            request,

            transaction

        });


        await createCardLedgerEvent({

            transaction,
    
            card,
    
            eventType: 'CARD_GENERATED'
    
        });

    return {

        request,

        card

    };

}

module.exports = {

    requestAndGenerateCard

};