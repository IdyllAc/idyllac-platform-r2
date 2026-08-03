// services/cards/replaceCard.js

const {

    BankAccount
} = require('../../models');

const {
    requestAndGenerateCard
} = require('./cardWorkflow');

async function replaceCard({

    card,

    transaction

}) {

    if (!card) {

        throw new Error(
            'Card is required.'
        );

    }

    if (card.status !== 'ACTIVE') {

        throw new Error(
            'Only ACTIVE cards can be replaced.'
        );

    }

    const bankAccount =
        await BankAccount.findByPk(

            card.bankAccountId,

            { transaction }

        );

    if (!bankAccount) {

        throw new Error(
            'Bank account not found.'
        );

    }


    const {

        request,
    
        card: newCard
    
    } = await requestAndGenerateCard({
    
         userId: card.userId,
       
    
        cardHolderName:
            card.cardHolderName,
    
        transaction
    
    });



    //
    // Mark old card replaced
    //

    card.status = 'REPLACED';

    card.replacedAt =
        new Date();

    await card.save({

        transaction

    });

    return {

        oldCard: card,

        newCard,

        request

    
    };

}

module.exports = replaceCard;