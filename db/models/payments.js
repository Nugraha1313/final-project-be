'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payments.belongsTo(models.Transactions, {
        foreignKey: 'transaction_id',
        as: 'transaction'
      })
    }
  }
  Payments.init({
    transaction_id: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    is_complete: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Payments',
    tableName: 'payments',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Payments;
};