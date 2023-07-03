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
        as: 'flight'
      })
    }
  }
  Airplanes.init({
    model: DataTypes.STRING,
    code: DataTypes.STRING,
    airline_code: DataTypes.STRING,
    seat_layout: DataTypes.STRING,
    seat_pitch: DataTypes.STRING,
    seat_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Airplanes',
    tableName: 'airplanes',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Airplanes;
};