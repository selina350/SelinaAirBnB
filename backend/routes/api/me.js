const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const { Spot, Review, Image, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

//get all spots by current user
router.get("/spots", requireAuth, async (req, res, next) => {
  const id = req.user.id;
  const spots = await Spot.findAll({
    where: { ownerId: id },
  });
  res.json(spots);
});

//Get all Reviews of the Current User
router.get("/reviews", requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const allReviews = await Review.findAll({
    where: { userId },
    attributes: {
      include: [[Sequelize.col("Spot.SpotImages.url"), "Spot.previewImage"]],
    },
    include: [
      {
        model: Spot,
        include: {
          model: Image,
          as: "SpotImages",
          attributes: [],
          where: { preview: true },
          required: false,
        },
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
        required: false,
      },
      {
        model: Image,
        as: "ReviewImages",
      },
    ],
  });

  res.json(allReviews);
});

module.exports = router;
