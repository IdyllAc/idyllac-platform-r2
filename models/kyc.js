// models/kyc.js

module.exports = (sequelize, DataTypes) => {

    const Kyc = sequelize.define('Kyc', {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        status: {
            type: DataTypes.ENUM(
                'PENDING',
                'APPROVED',
                'REJECTED',
                'SUSPENDED'
            ),
            allowNull: false,
            defaultValue: 'PENDING'
        },

        submittedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },

        reviewedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },

        reviewedBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        riskScore: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }

    }, {

        tableName: 'kyc',

        indexes: [

            {
                fields: ['userId']
            },

            {
                fields: ['status']
            }

        ]

    });

    Kyc.associate = (models) => {

        Kyc.belongsTo(models.User, {

            foreignKey: 'userId',

            as: 'user'

        });

    };

    return Kyc;

};