// models/beneficiary.js

module.exports = (sequelize, DataTypes) => {

  const Beneficiary = sequelize.define('Beneficiary', {

    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    bankAccountId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    beneficiaryName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    beneficiaryType: {
      type: DataTypes.ENUM(
          'INTERNAL',
          'EXTERNAL'
      ),
      allowNull: false,
      defaultValue: 'EXTERNAL'
  },

    iban: {
      type: DataTypes.STRING,
      allowNull: false
      // unique removed because two users may add same beneficiary
    },

    bic: {
      type: DataTypes.STRING,
      allowNull: false
    },

    bankName: {
      type: DataTypes.STRING,
      allowNull: true
    },

    country: {
      type: DataTypes.STRING(2),
      defaultValue: 'FR'
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'EUR'
    },

    transferNetwork: {
      type: DataTypes.ENUM(
        'SEPA',
        'SWIFT',
        'INTERNAL'
      ),
      defaultValue: 'SEPA'
    },

    status: {
      type: DataTypes.ENUM(
        'PENDING',
        'VERIFIED',
        'ACTIVE',
        'BLOCKED',
        'DEACTIVATED'
      ),
      defaultValue: 'PENDING'
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    isFavorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    riskScore: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    lastUsedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }

  }, {

    tableName: 'beneficiaries',

    indexes: [

      {
        fields: ['userId']
      },

      {
        fields: ['iban']
      },

      {
        fields: ['status']
      }

    ]

  });

  Beneficiary.associate = (models) => {

    Beneficiary.belongsTo(models.User, {

      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'

    });

    Beneficiary.belongsTo(models.BankAccount, {

      foreignKey: 'bankAccountId',
      as: 'bankAccount',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'

    });

  };

  return Beneficiary;

};