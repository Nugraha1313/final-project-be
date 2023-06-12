'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airplanes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Airplanes.hasMany(models.Flights, {
        foreignKey: "airplane_id",
        as: 'flights'
      })
    }
  }
  Airplanes.init({
    name: DataTypes.STRING,
    baggage: DataTypes.INTEGER,
    cabin_baggage: DataTypes.INTEGER,
    total_seats: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Airplanes',
  });
  return Airplanes;
};