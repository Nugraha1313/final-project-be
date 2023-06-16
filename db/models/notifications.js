'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notifications.belongsTo(models.Users, {
        foreignKey: "user_id",
        as: "user"
      })
    }
  }
  Notifications.init({
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    body: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Notifications',
    tableName: 'notifications',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Notifications;
};