'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Airports.hasMany(models.Flights, {
        foreignKey: "departure",
        as: "flight_departure"
      })

      Airports.hasMany(models.Flights, {
        foreignKey: "destination",
        as: "flight_destination"
      })
    }
  }
  Airports.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Airports',
  });
  return Airports;
};