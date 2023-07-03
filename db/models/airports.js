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
        foreignKey: "departure_airport_id",
        as: "departure"
      })

      Airports.hasMany(models.Flights, {
        foreignKey: "arrival_airport_id",
        as: "arrival"
      })
    }
  }
  Airports.init({
    name: DataTypes.STRING,
    iata_code: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Airports',
    tableName: 'airports',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Airports;
};