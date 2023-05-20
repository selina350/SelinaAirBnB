"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.hasMany(models.Image, {
        foreignKey: "imageableId",
        constraints: false,
        scope: {
          imageableType: "Review",
        },
      });
      Review.belongsTo(models.User);
      Review.belongsTo(models.Spot);
    }
  }
  Review.init(
    {
      review: {
        type: DataTypes.STRING,
      },
      stars: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
          max: 5,
        },
      },
      spotId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
