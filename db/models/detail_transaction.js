'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Detail_transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Detail_transaction.belongsTo(models.Passengers, {
        foreignKey: 'passenger_id',
        as: 'passenger'
      })

      Detail_transaction.hasOne(models.Tickets, {
        foreignKey: 'detail_transaction_id',
        as: 'ticket'
      })

      Detail_transaction.belongsTo(models.Transactions, {
        foreignKey: 'transaction_id',
        as: 'transaction'
      })
    }
  }
  Detail_transaction.init({
    transaction_id: DataTypes.INTEGER,
    passenger_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Detail_transaction',
  });
  return Detail_transaction;
};