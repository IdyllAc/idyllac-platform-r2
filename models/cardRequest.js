// models/cardRequest.js

'use strict';

module.exports = (sequelize, DataTypes) => {

    const CardRequest = sequelize.define('CardRequest', {

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        bankAccountId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        cardHolderName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        currency: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'EUR'
        },

        type: {
            type: DataTypes.STRING,
            allowNull: false
        },

        level: {
            type: DataTypes.STRING,
            allowNull: false
        },

        physical: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        virtual: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        status: {

            type: DataTypes.ENUM(

                'REQUESTED',

                'APPROVED',

                'GENERATED',

                'CANCELLED'

            ),

            allowNull: false,

            defaultValue: 'REQUESTED'

        },

        requestedAt: {
            type: DataTypes.DATE
        },

        approvedAt: {
            type: DataTypes.DATE
        },

        generatedAt: {
            type: DataTypes.DATE
        },

        cancelledAt: {
            type: DataTypes.DATE
        },

    }, {
            
            tableName: 'card_requests',
            freezeTableName: true,

        }
    );

    CardRequest.associate = models => {

        CardRequest.belongsTo(models.User, {

            foreignKey: 'userId'

        });

        CardRequest.belongsTo(models.BankAccount, {

            foreignKey: 'bankAccountId'

        });

    };

    return CardRequest;

};