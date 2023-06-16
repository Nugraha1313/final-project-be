'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Notifications, {
        foreignKey: "user_id",
        as: "notifications"
      })

      Users.hasMany(models.Transactions, {
        foreignKey: 'user_id',
        as: 'transaction'
      })
    }
  }
  Users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    otp: DataTypes.STRING,
    role: DataTypes.STRING,
    user_type: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Users;
};