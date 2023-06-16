'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Passengers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Passengers.belongsTo(models.Passenger_type, {
        foreignKey: 'passenger_type_id',
        as: 'passenger_type'
      })

      Passengers.hasOne(models.Detail_transaction, {
        foreignKey: 'passenger_id',
        as: 'detail_transaction'
      })
    }
  }
  Passengers.init({
    name: DataTypes.STRING,
    date_of_birth: DataTypes.STRING,
    nationality: DataTypes.STRING,
    ktp: DataTypes.STRING,
    passport: DataTypes.STRING,
    passenger_type_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Passengers',
    tableName: 'passengers',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Passengers;
};