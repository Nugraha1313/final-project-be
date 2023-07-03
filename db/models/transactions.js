'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transactions.belongsTo(models.Users, {
        foreignKey: 'user_id',
        as: 'user'
      })

      Transactions.hasOne(models.Payments, {
        foreignKey: 'transaction_id',
        as: 'payment'
      })

      Transactions.hasMany(models.Detail_transaction, {
        foreignKey: 'transaction_id',
        as: 'detail_transaction'
      })

      Transactions.belongsTo(models.Flights, {
        foreignKey: 'flight_id',
        as: 'flight'
      })
    }
  }
  Transactions.init({
    user_id: DataTypes.INTEGER,
    flight_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transactions',
    tableName: 'transactions',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Transactions;
};