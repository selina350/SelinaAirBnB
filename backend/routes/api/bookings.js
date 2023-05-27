const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Spot, Booking, Image, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateBooking = [
  check("startDate")
    .exists({ checkFalsy: true })
    .isDate()
    .withMessage("startDate has to be a date"),
  check("endDate")
    .exists({ checkFalsy: true })
    .isDate()
    .withMessage("endDate has to be a date"),

  handleValidationErrors,
];

//Get all Bookings by a Spot's id
router.get("/", requireAuth, async (req, res, next) => {
  const spotId = +req.spotId;
  const ownerId = +req.user.id;
  if (isNaN(spotId)) {
    res.status(400).json("spot id has to be a number");
  }
  const spot = await Spot.findByPk(spotId);
  let bookings;
  if (spot) {
    if (spot.ownerId !== ownerId) {
      bookings = await Booking.findAll({
        where: { spotId },
        attributes: ["spotId", "startDate", "endDate"],
      });
    } else {
      bookings = await Booking.findAll({
        where: { spotId },
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });
    }
    res.json({ Bookings: bookings });
  } else {
    res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
});

//Create a Booking for a Spot based on the Spot's id
router.post("/", requireAuth, validateBooking, async (req, res, next) => {
  const spotId = req.spotId;
  const userId = req.user.id;
  const { startDate, endDate } = req.body;
  if (isNaN(spotId)) {
    res.status(400).json("spot id has to be a number");
  }
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  const conflictedBooking = await Booking.findAll({
    where: {
      spotId,
      startDate: { [Op.lte]: endDate },
      endDate: { [Op.gte]: startDate },
    },
  });
  if (conflictedBooking.length > 0) {
    res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  } else {
    const booking = await Booking.create({
      spotId,
      userId,
      startDate,
      endDate,
    });
    res.json({ booking });
  }
});

//Edit a booking
router.put("/:id", requireAuth, validateBooking, async (req, res, next) => {
  const userId = req.user.id;
  const { startDate, endDate } = req.body;
  const bookingId = req.params.id;
  if (isNaN(bookingId)) {
    res.status(400).json("booking id has to be a number");
  }
  const bookingInDb = await Booking.findOne({
    where: {
      id: bookingId,
      userId,
    },
  });
  if (bookingInDb) {
    const spotId = bookingInDb.spotId;
    const conflictedBooking = await Booking.findAll({
      where: {
        spotId,
        startDate: { [Op.lte]: endDate },
        endDate: { [Op.gte]: startDate },
        //should not conflict with itself.
        id: { [Op.ne]: bookingId },
      },
    });
    if (conflictedBooking.length > 0) {
      res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    } else {
      bookingInDb.startDate = startDate;
      bookingInDb.endDate = endDate;
      bookingInDb.save();
      res.json(bookingInDb);
    }
  } else {
    res.status(404).json({
      message: "Booking can not be found or doesn't belong to this user.",
    });
  }
});

//Delete a Booking
router.delete("/:id", requireAuth, async (req, res, next) => {
  const bookingId = +req.params.id;
  const userId = +req.user.id;
  if (isNaN(bookingId)) {
    res.status(400).json("id has to be a number");
  }
  const booking = await Booking.findOne({
    where: {
      id: bookingId,
      userId,
    },
  });
  if (booking) {
    await booking.destroy();
    res.json("Successfully deleted");
  } else {
    res.status(404).json({
      message: "Booking can not be found or doesn't belong to this user.",
    });
  }
});

module.exports = router;
