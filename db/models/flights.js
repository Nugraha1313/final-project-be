'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flights extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Flights.belongsTo(models.Airplanes, {
        foreignKey: "airplane_id",
        as: "airplane"
      })

      Flights.belongsTo(models.Airports, {
        foreignKey: "departure",
        as: "flight_departure"
      })

      Flights.belongsTo(models.Airports, {
        foreignKey: "destination",
        as: "flight_destination"
      })

      Flights.belongsTo(models.Region_category, {
        foreignKey: "region_category_id",
        as: "region_category"
      })

      Flights.hasMany(models.Transactions, {
        foreignKey: 'flight_id',
        as: 'transaction'
      })
    }
  }
  Flights.init({
    airplane_id: DataTypes.INTEGER,
    departure: DataTypes.INTEGER,
    destination: DataTypes.INTEGER,
    departure_date: DataTypes.DATE,
    arrival_date: DataTypes.DATE,
    departure_time: DataTypes.STRING,
    arrival_time: DataTypes.STRING,
    available_seats: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    operation_status: DataTypes.BOOLEAN,
    region_category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Flights',
  });
  return Flights;
};