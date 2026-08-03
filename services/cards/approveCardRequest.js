// services/cards/approveCardRequest.js

const {
    CardRequest
} = require('../../models');

async function approveCardRequest({

    request,

    transaction

}) {

    if (!request) {

        throw new Error(
            'Card request is required.'
        );

    }

    if (request.status !== 'REQUESTED') {

        throw new Error(
            'Only REQUESTED card requests can be approved.'
        );

    }

    request.status = 'APPROVED';

    request.approvedAt = new Date();

    await request.save({

        transaction

    });

    return request;

}

module.exports = approveCardRequest;