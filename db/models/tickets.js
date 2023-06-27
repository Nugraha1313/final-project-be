'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tickets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tickets.belongsTo(models.Detail_transaction, {
        foreignKey: 'detail_transaction_id',
        as: 'detail_transaction'
      })
    }
  }
  Tickets.init({
    detail_transaction_id: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN,
    code: DataTypes.STRING,
    qr_image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tickets',
    tableName: 'tickets',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Tickets;
};