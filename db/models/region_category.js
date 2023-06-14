'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Region_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Region_category.hasMany(models.Flights, {
        foreignKey: "region_category_id",
        as: "flight_category"
      })
    }
  }
  Region_category.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Region_category',
  });
  return Region_category;
};