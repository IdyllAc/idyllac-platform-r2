// routes/card.js
const express = require('express');
const router = express.Router();

const combinedAuth = require('../middleware/combinedAuth');
const cardController = require('../controllers/cardController');


// GET USER CARDS
router.get('/', combinedAuth, cardController.getCards);




// 1. REQUEST CARD
router.post('/request', combinedAuth, cardController.requestCard);


// APPROVE CARD REQUEST
router.post('/:requestId/approve', combinedAuth, cardController.approveCardRequest);


// GENERATE CARD
router.post('/:requestId/generate', combinedAuth, cardController.generateCard);



// 4. Activate Card
router.post('/:cardId/activate', combinedAuth, cardController.activateCard);


// 5. Freeze Card
router.post('/:cardId/freeze', combinedAuth, cardController.freezeCard);

  
// 6. Unfreeze Card
router.post('/:cardId/unfreeze', combinedAuth, cardController.unfreezeCard);

  
// 7. Replace Card
router.post('/:cardId/replace', combinedAuth, cardController.replaceCard);

  


// 8. Close Card
router.post('/:cardId/close', combinedAuth, cardController.closeCard);


module.exports = router;