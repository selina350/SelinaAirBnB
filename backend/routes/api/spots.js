const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { Spot, Review, Image, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const reviewsRouter = require("./reviews.js");
const bookingRouter = require("./bookings.js");
const imageRouter = require("./images.js");
router.use(
  "/:id/reviews",
  (req, res, next) => {
    req.spotId = +req.params.id;
    if (isNaN(req.spotId)) {
      return res.status(400).json({ message: "spotId has to be a number" });
    }
    next();
  },
  reviewsRouter
);
router.use(
  "/:id/bookings",
  (req, res, next) => {
    req.spotId = +req.params.id;
    if (isNaN(req.spotId)) {
      return res.status(400).json({ message: "spotId has to be a number" });
    }
    next();
  },
  bookingRouter
);

router.use(
  "/:id/images",
  requireAuth,
  async (req, res, next) => {
    req.spotId = +req.params.id;
    const ownerId = req.user.id;
    if (isNaN(req.spotId)) {
      return res.status(400).json({ message: "spotId has to be a number" });
    }

    const spot = await Spot.findByPk(req.spotId);

    if (!spot || ownerId !== spot.ownerId) {
      return res
        .status(400)
        .json("Spot can not be found or doesn't belong to this user.");
    }

    next();
  },
  imageRouter
);

const validateQuery = [
  check("page")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Page must be greater than or equal to 1."),
  check("size")
    .optional()

    .isInt({ min: 1, max: 20 })
    .withMessage("Size must be greater than or equal to 1"),
  check("maxLat")
    .optional()
    .isDecimal()
    .withMessage("Maximum latitude is invalid"),
  check("minLat")
    .optional()
    .isDecimal()
    .withMessage("Minimum latitude is invalid"),
  check("maxLng")
    .optional()
    .isDecimal()
    .withMessage("MaxLng latitude is invalid"),
  check("minLng")
    .optional()
    .isDecimal()
    .withMessage("MinLng latitude is invalid"),
  check("maxPrice")
    .optional()
    .isDecimal()
    .withMessage("Maximum price must be greater than or equal to 0"),
  check("minPrice")
    .optional()
    .isDecimal()
    .withMessage("Minimum price must be greater than or equal to 0"),

  handleValidationErrors,
];
//get all spots or current user spots
router.get("/", validateQuery, async (req, res, next) => {
  const ownerId = req.ownerId;
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;
  let limit;
  let offset;

  if (page < 0 || page > 10 || isNaN(page)) {
    page = 1;
  }
  if (size < 0 || size > 20 || isNaN(size)) {
    size = 20;
  }

  limit = size;
  offset = size * (page - 1);
  const where = {};
  const lat = {};
  const lng = {};
  const price = {};

  if (ownerId) {
    where.ownerId = ownerId;
  }

  let shouldAddLat;
  if (minLat !== undefined) {
    shouldAddLat = true;
    lat[Op.gte] = minLat;
  }
  if (maxLat !== undefined) {
    shouldAddLat = true;
    lat[Op.lte] = maxLat;
  }
  if (shouldAddLat) {
    where.lat = lat;
  }

  let shouldAddLng;
  if (minLng !== undefined) {
    shouldAddLng = true;
    lng[Op.gte] = minLng;
  }
  if (maxLng !== undefined) {
    shouldAddLng = true;
    lng[Op.lte] = maxLng;
  }
  if (shouldAddLng) {
    where.lng = lng;
  }

  let shouldAddPrice;
  if (minPrice !== undefined) {
    shouldAddPrice = true;
    price[Op.gte] = minPrice;
  }
  if (maxPrice !== undefined) {
    shouldAddPrice = true;
    price[Op.lte] = maxPrice;
  }
  if (shouldAddPrice) {
    where.price = price;
  }

  const allSpots = await Spot.findAll({
    //google searched: "sequelize limit after include"
    //found a solution to disable subQuery
    subQuery: false,
    limit,
    offset,
    attributes: {
      include: [
        [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
        [Sequelize.col("SpotImages.url"), "previewImage"],
      ],
    },
    group: ["Spot.id", "SpotImages.url"],
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
    where,
  });

  res.json(allSpots);
});

//Add Query Filters to Get All Spots
router.get("/", validateQuery, async (req, res, next) => {
  const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;
  let limit;
  let offset;

  if (page < 0 || page > 10) {
    page = 1;
  }
  if (size < 0 || size > 20) {
    size = 20;
  }

  limit = size;
  offset = size * (page - 1);

  const querySpots = await Spot.findAll({
    attributes: ["id", "firstName", "lastName", "leftHanded"],
    where: {
      lat: { [Op.gte]: minLat, [Op.lte]: maxLat },
      lng: { [Op.gte]: minLng, [Op.lte]: maxLng },
      price: { [Op.gte]: minPrice, [Op.lte]: maxPrice },
    },
    limit,
    offset,
  });
  res.json(querySpots);
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
    group: ["Spot.id", "User.id", "SpotImages.id"],
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
      message: "spot can not be found or doesn't belong to this user.",
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
      message: "spot can not be found or doesn't belong to this user.",
    });
  }
});

module.exports = router;
