"use strict";
const { Model } = require("sequelize");
const { Review } = require("../models");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, { foreignKey: "ownerId" });
      Spot.hasMany(models.Image, {
        as: "SpotImages",
        foreignKey: "imageableId",
        constraints: false,
        scope: {
          imageableType: "Spot",
        },
      });

      Spot.belongsToMany(models.User, {
        through: models.Review,
        foreignKey: "spotId",
        otherKey: "userId",
      });
      // Spot.hasMany(models.Review);
      Spot.belongsToMany(models.User, {
        through: models.Booking,
        foreignKey: "spotId",
        otherKey: "userId",
      });
      // Spot.hasMany(models.Booking);
    }
  }
  Spot.init(
    {
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: {
        type: DataTypes.FLOAT,
      },
      lng: {
        type: DataTypes.FLOAT,
      },
      name: {
        type: DataTypes.STRING,
        validate: {
          len: [1, 50],
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Spot",

    }
  );
  return Spot;
};
