// services/transfers/listTransfers.js

const { Transfer } = require('../../models');

async function listTransfers({

    userId

}) {

    return await Transfer.findAll({

        where: {

            userId

        },

        order: [

            ['createdAt', 'DESC']

        ]

    });

}

module.exports = listTransfers;