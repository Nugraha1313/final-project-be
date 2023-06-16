'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Schedules.init({
    departure_airport: DataTypes.STRING,
    arrival_airport: DataTypes.STRING,
    price: DataTypes.INTEGER,
    departure_terminal_name: DataTypes.STRING,
    arrival_terminal_name: DataTypes.STRING,
    flight_number: DataTypes.STRING,
    airline_code: DataTypes.STRING,
    airplane_code: DataTypes.STRING,
    free_baggage: DataTypes.INTEGER,
    cabin_baggage: DataTypes.INTEGER,
    flight_day: DataTypes.STRING,
    departure_base_timestamp: DataTypes.INTEGER,
    arrival_base_timestamp: DataTypes.INTEGER,
    class: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Schedules',
    tableName: 'schedules',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Schedules;
};