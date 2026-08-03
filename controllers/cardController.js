// controllers/cardController.js

const { sequelize, Card, CardRequest } = require('../models');
const {

  requestCard,
  approveCardRequest,
  generateCard,
  activateCard,
  freezeCard,
  unfreezeCard,
  replaceCard,
  closeCard

} = require('../services/cards/cardService');

exports.getCards = async (req, res) => {

  try {

    //
    // GET USER CARDS
    //

    const cards = await Card.findAll({
      where: { userId: req.user.id }
    });

    res.json(cards);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Failed to load cards'
    });

  }

};


// exports.requestCard = withTransaction(async (transaction, req, res) => {
 exports.requestCard = async (req, res) => {

   const transaction = await sequelize.transaction();

  try {

      //
      // 1. Request
      //

      const request = await requestCard({

          userId: req.user.id,

          cardHolderName: req.user.name,

          transaction

      });

      await transaction.commit();

      return res.status(201).json({

          success: true,

          request

      });

  } catch (err) {

      await transaction.rollback();

      console.error(err);

      return res.status(500).json({

          success: false,

          error: err.message

      });

  }

};




exports.approveCardRequest = async (req, res) => {

  const transaction = await sequelize.transaction();

  try {

    //
    // 2. Approve
    //

      const request = await CardRequest.findOne({
          
            where: {
              id: req.params.requestId,
              userId: req.user.id
            },
  
            transaction
       });

      if (!request) {
          return res.status(404).json({
              success: false,
              error: 'Card request not found'
          });
      }

      const approvedRequest = await approveCardRequest({

          request,
          transaction: approvedRequest
      });


      await transaction.commit();


      return res.json({
          success: true,
          request
      });

  } catch (err) {

      await transaction.rollback();

      console.error(err);

      return res.status(500).json({

          success: false,
          error: err.message
      });

  }

};



exports.generateCard = async (req, res) => {
  
    const transaction = await sequelize.transaction();
  
    try {
  
      //
      // 3. Generate
      //

      const request = await CardRequest.findOne({

        where: {
            id: req.params.requestId,
            userId: req.user.id
        },

        transaction
      });

      if (!request) {
          return res.status(404).json({
              success: false,
              error: 'Card request not found'
          });

        }
  
        const card = await generateCard({
  
            request,
            transaction
  
        });
  
        await transaction.commit();
  
        return res.status(201).json({
  
            success: true,
            card
        });
  
    } catch (err) {
  
        await transaction.rollback();
  
        console.error(err);
  
        return res.status(500).json({
  
            success: false,
  
            error: err.message
  
        });
  
    }
  
  };



  exports.activateCard = async (req, res) => {
  
    const transaction = await sequelize.transaction();
  
    try {
  
      const card = await Card.findOne({
          
          where: {
            id: req.params.cardId,
            userId: req.user.id
          },

             transaction 
       });
  
      if (!card) {
          return res.status(404).json({
              success: false,
              error: 'Card not found'
          });
      }
  
      const activatedCard = await activateCard({
  
          card,
          transaction
  
      });

  
      await transaction.commit();

  
      return res.json({
  
          success: true,
          card: activatedCard
      });
  
    } catch (err) {
  
        await transaction.rollback();
  
        console.error(err);
  
        return res.status(500).json({
  
            success: false,
            error: err.message
        });
  
    }
  
  };



  exports.freezeCard = async (req, res) => {
  
    const transaction = await sequelize.transaction();

    try {
  
      const card = await Card.findOne({
  
        where: {
          id: req.params.cardId,
          userId: req.user.id
  
        },
  
            transaction
      });
  
      if (!card) {
          return res.status(404).json({
              success: false,
              error: 'Card not found'
          });
      }
  
      const frozenCard = await freezeCard({
  
          card,
          transaction
  
      });
  
  
      await transaction.commit();
  
      return res.json({
        success: true,
        card: frozenCard
  
    });
  
    } catch (err) {
  
        await transaction.rollback();
  
        console.error(err);
  
        return res.status(500).json({
  
            success: false,
            error: err.message
        });
  
    }
  
  };


 
  exports.unfreezeCard = async (req, res) => {

    const transaction = await sequelize.transaction();

    try {

      const card = await Card.findOne({
          
          where: {
            id: req.params.cardId,
            userId: req.user.id
          },
  
                transaction
       });


      if (!card) {
          return res.status(404).json({
              success: false,
              error: 'Card not found'
          });
      }

      const unfrozenCard = await unfreezeCard({

          card,
          transaction

      });


      await transaction.commit();


      return res.json({

          success: true,
          card: unfrozenCard
      });

    } catch (err) {

      await transaction.rollback();

      console.error(err);

      return res.status(500).json({

          success: false,
          error: err.message
      });

  }

};



exports.replaceCard = async (req, res) => {

  const transaction = await sequelize.transaction();

  try {
      
      const card = await Card.findOne({

          where: {
            id: req.params.cardId,
            userId: req.user.id
          },

              transaction

        });

  
      if (!card) {
          return res.status(404).json({
              success: false,
              error: 'Card not found'
          });
      }
  
      const replacement = await replaceCard({
          
            card,
            transaction
  
      });

  
      await transaction.commit();

  
      return res.status(200).json({
  
            success: true,
            oldCard: replacement.oldCard,
            newCard: replacement.newCard,
            request: replacement.request
          
      });
  
    } catch (err) {
        
        await transaction.rollback();
  
        console.error(err);
  
        return res.status(500).json({

            success: false,
            error: err.message
        });

    }

};



exports.closeCard = async (req, res) => {

  const transaction = await sequelize.transaction();

  try {

    const card = await Card.findOne({

            where: {
                id: req.params.cardId,
                userId: req.user.id
            },

             transaction

       });
       

    if (!card) {
        return res.status(404).json({
            success: false,
            error: 'Card not found'
        });
    }

    const closedCard = await closeCard({

        card,
        transaction

    });


    await transaction.commit();


    return res.json({

        success: true,
        card: closedCard
    });

  } catch (err) {

      await transaction.rollback();

      console.error(err);

      return res.status(500).json({

          success: false,
          error: err.message
      });

  }

};


