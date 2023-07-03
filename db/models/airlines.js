'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airlines extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Airlines.hasMany(models.Flights, {
        foreignKey: 'airline_id',
        as: 'flight'
      })
    }
  }
  Airlines.init({
    name: DataTypes.STRING,
    short_name: DataTypes.STRING,
    iata_code: DataTypes.STRING,
    icon_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Airlines',
    tableName: 'airlines',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Airlines;
};