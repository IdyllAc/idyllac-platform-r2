// models/idempotencyKey.js
module.exports = (sequelize, DataTypes) => {

    const IdempotencyKey =
      sequelize.define(
        'IdempotencyKey',
        {

          userId: {
            type: DataTypes.INTEGER,
            allowNull: false
            },
  
          key: {
            type: DataTypes.STRING,
            allowNull: false
          },

          endpoint: {
            type: DataTypes.STRING,
            allowNull: false
          },
  
          method: {
            type: DataTypes.STRING,
            allowNull: false
          },
  
          status: {
            type: DataTypes.ENUM(
              'PROCESSING',
              'COMPLETED',
              'FAILED'
            ),
            defaultValue: 'PROCESSING'
          },
  
          response: {
            type: DataTypes.JSONB,
            allowNull: true
          }
  
        },
        {
          tableName: 'idempotency_keys'
        }
      );
  
    return IdempotencyKey;
  
  };