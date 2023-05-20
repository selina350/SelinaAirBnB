const express = require("express");
const router = express.Router();
const { Spot } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

//get all spots
router.get("/", async (req, res, next) => {
  const allSpots = await Spot.findAll();
  res.json(allSpots);
});

router.get("/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "id has to be a number" });
  }
  const spot = await Spot.findByPk(id);
  if (spot) {
    res.json(spot);
  } else {
    res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
});

//create new spot
const validateCreateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required."),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),

  handleValidationErrors,
];
router.post("/", requireAuth, validateCreateSpot, async (req, res, next) => {
  const ownerId = parseInt(req.user.id);
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const newSpot = await Spot.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.json(newSpot);
});

module.exports = router;
