// controllers/cardController.js

const { Card } = require('../models');

exports.getCards = async (req, res) => {

  try {

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