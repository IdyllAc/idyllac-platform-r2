// services/transfers/getTransfer.js

const { Transfer } = require('../../models');

async function getTransfer({

    transferId,
    userId

}) {

    return await Transfer.findOne({

        where: {

            id: transferId,
            userId

        }

    });

}

module.exports = getTransfer;