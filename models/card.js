// models/Card.js

module.exports = (sequelize, DataTypes) => {

  const Card = sequelize.define('Card', {

    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    // =========================
    // RELATION
    // =========================
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // =========================
    // CARD DETAILS
    // =========================

    cardHolderName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    maskedNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },

    last4: {
      type: DataTypes.STRING(4),
      allowNull: false
    },

    expiryMonth: {
      type: DataTypes.STRING(2),
      allowNull: false
    },

    expiryYear: {
      type: DataTypes.STRING(4),
      allowNull: false
    },

    cvv: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // =========================
    // BANKING
    // =========================

    iban: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    bic: {
      type: DataTypes.STRING,
      allowNull: false
    },

    currency: {
      type: DataTypes.STRING,
      defaultValue: 'EUR'
    },

    bankAccountId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // =========================
    // CARD TYPE
    // =========================

    type: {
      type: DataTypes.STRING,
      defaultValue: 'VISA'
    },

    level: {
      type: DataTypes.STRING,
      defaultValue: 'CLASSIC'
    },

    physical: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    virtual: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    // =========================
    // SECURITY
    // =========================

    status: {
      type: DataTypes.ENUM(
        'active',
        'blocked',
        'expired',
        'pending'
      ),
      defaultValue: 'active'
    },

    isFrozen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    dailyLimit: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 5000
    },

    contactlessEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    activatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }

  }, {

    tableName: 'cards'

  });

  // =========================
  // ASSOCIATIONS
  // =========================

  Card.associate = (models) => {

    Card.belongsTo(models.BankAccount, {

      foreignKey: 'bankAccountId',
    
      as: 'bankAccount',

      onDelete: 'CASCADE',

      onUpdate: 'CASCADE'

    });

    Card.hasMany(models.Transaction, {

      foreignKey: 'cardId',
    
      as: 'transactions'
    
    });

  };

  return Card;

};