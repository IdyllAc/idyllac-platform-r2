'use strict';

module.exports = {

    async up(queryInterface) {

        await queryInterface.removeConstraint(
            'cards',
            'cards_iban_key'
        );

    },

    async down(queryInterface) {

        await queryInterface.addConstraint(
            'cards',
            {
                fields: ['iban'],
                type: 'unique',
                name: 'cards_iban_key'
            }
        );

    }

};