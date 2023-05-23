const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const { Spot, Review, Image, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

//get all spots
router.get("/", async (req, res, next) => {
  const allSpots = await Spot.findAll({
    group: ["Spot.id", "SpotImages.url"],
    attributes: {
      include: [
        [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
        [Sequelize.col("SpotImages.url"), "previewImage"],
      ],
    },
    include: [
      {
        model: Review,
        attributes: [],
      },
      {
        model: Image,
        as: "SpotImages",
        attributes: [],
        where: { preview: true },
        required: false,
      },
    ],
  });

  res.json(allSpots);
});

//Get details of a Spot from an id
router.get("/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "id has to be a number" });
  }

  const spot = await Spot.findByPk(id, {
    attributes: {
      include: [
        [Sequelize.fn("COUNT", Sequelize.col("Reviews.id")), "numReviews"],
        [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
      ],
    },
    include: [
      {
        model: Review,
        attributes: [],
        required: false,
      },
      {
        model: Image,
        attributes: ["id", "url", "preview"],
        as: "SpotImages",
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
        required: false,
      },
    ],
    group: ["Spot.id", "SpotImages.id"],
  });
  if (spot) {
    res.json(spot);
  } else {
    res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
});

const validateSpot = [
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

//create new spot
router.post("/", requireAuth, validateSpot, async (req, res, next) => {
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

//Add an Image to a Spot based on the Spot's id
router.post("/:id/images", requireAuth, async (req, res, next) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "id has to be a number" });
  }
  const ownerId = parseInt(req.user.id);
  const { url, preview } = req.body;
  const spot = await Spot.findByPk(req.params.id, {
    where: { ownerId },
  });
  if (spot) {
    const image = await Image.create({
      imageableId: spot.id,
      url,
      preview,
      imageableType: "Spot",
    });

    res.json({ id: image.id, url, preview });
  } else {
    res.status(400).json({
      message: "spot can not be found.",
    });
  }
});

//edit a spot
router.put("/:id", requireAuth, validateSpot, async (req, res, next) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "id has to be a number" });
  }
  const ownerId = parseInt(req.user.id);
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const spot = await Spot.findByPk(req.params.id, {
    where: { ownerId },
  });

  if (spot) {
    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;
    await spot.save();
    res.json(spot);
  } else {
    res.status(400).json({
      message: "spot can not be found.",
    });
  }
});

//delete spot
router.delete("/:id", requireAuth, async (req, res, next) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ message: "id has to be a number" });
  }
  const ownerId = parseInt(req.user.id);

  const spot = await Spot.findByPk(req.params.id, {
    where: { ownerId },
  });

  if (spot) {
    await spot.destroy();
    res.json("Successfully deleted");
  } else {
    res.status(400).json({
      message: "spot can not be found.",
    });
  }
});

module.exports = router;
