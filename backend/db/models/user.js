"use strict";
const { Model, Validator } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Spot, {
        foreignKey: "ownerId",
        onDelete: "CASCADE",
        hooks: true,
      });
      
      User.belongsToMany(
        models.Spot,
        { through: models.Review,
          foreignKey: 'userId',
          otherKey: 'spotId'
        }
      );
      User.hasMany(
        models.Review,
      );
      User.belongsToMany(
        models.Spot,
        { through: models.Booking,
          foreignKey: 'userId',
          otherKey: 'spotId'
        }
      );
      User.hasMany(
        models.Booking,
      );
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          len: [3, 256],
        },
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("username can not be an email.");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"],
        },
      },
    }
  );
  return User;
};
