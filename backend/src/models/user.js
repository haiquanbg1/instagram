'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    birthday: DataTypes.DATE,
    role: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    privacy: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: "users",
    modelName: 'User',
  });
  return User;
};