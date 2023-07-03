'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Passenger_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Passenger_type.hasMany(models.Passengers, {
        foreignKey: 'passenger_type_id',
        as: 'passenger'
      })
    }
  }
  Passenger_type.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Passenger_type',
    tableName: 'passenger_type',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Passenger_type;
};