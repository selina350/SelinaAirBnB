const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const { Spot, Review, Image, User, Booking } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

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
        attributes: ["id", "url"],
      },
    ],
  });

  res.json(allReviews);
});

//Get all of the Current User's Bookings
router.get("/bookings", requireAuth, async (req, res, next) => {
  const userId = req.user.id;
  const allBookings = await Booking.findAll({
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
    ],
  });

  res.json(allBookings);
});

module.exports = router;
