const express = require("express");
const router = express.Router();
const { Spot, Review, Image, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");


const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review test is required."),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be integer from 1 to 5"),

  handleValidationErrors,
];

//Get all Reviews by a Spot's id
router.get("/", async (req, res, next) => {
  const spotId = req.spotId;
  if (isNaN(spotId)) {
    res.status(400).json("id has to be a number");
  }
  const spot = await Spot.findByPk(spotId);
  if (spot) {
    const reviews = await Review.findAll({
      where: { spotId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Image,
          as: "ReviewImages",
          attributes: ["id", "url"],
        },
      ],
    });
    res.json({Reviews:reviews});
  } else {
    res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
});

//Create a Review for a Spot based on the Spot's id
router.post("/", requireAuth, validateReview, async (req, res, next) => {
  const spotId = req.spotId;
  const userId = req.user.id;
  const { review, stars } = req.body;
  if (isNaN(spotId)) {
    res.status(400).json("id has to be a number");
  }
  const spot = await Spot.findByPk(spotId);
  const existedReview = await Review.findOne({ where: { spotId, userId } });
  if (existedReview) {
    res.status(500).json("User already has a review for this spot.");
  } else if (spot) {
    const reviews = await Review.create({
      userId,
      spotId,
      review,
      stars,
    });
    res.json(reviews);
  } else {
    res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
});

//Add an Image to a Review based on the Review's id
router.post("/:id/images", requireAuth, async (req, res, next) => {
  const reviewId = req.params.id;
  const { url } = req.body;

  if (isNaN(reviewId)) {
    res.status(400).json("id has to be a number");
  }

  const review = await Review.findByPk(reviewId, {
    include: {
      model: Image,
      as: "ReviewImages",
    },
  });

  if (review) {
    if (review.ReviewImages.length >= 10) {
      res
        .status(403)
        .json("Maximum number of images for this resource was reached");
    }
    const image = await Image.create({
      url,
      imageableId: reviewId,
      imageableType: "Review",
    });
    res.json({ id: image.id, url });
  } else {
    res.status(404).json({
      message: "Review can not be found.",
    });
  }
});

//Edit a Review
router.put("/:id", requireAuth, validateReview, async (req, res, next) => {
  const userId = req.user.id;
  const { review, stars } = req.body;
  const reviewId = req.params.id;
  if (isNaN(reviewId)) {
    res.status(400).json("id has to be a number");
  }
  const reviewInDb = await Review.findByPk(reviewId);
  if (reviewInDb) {
    reviewInDb.review = review;
    reviewInDb.stars = stars;
    reviewInDb.save();
    res.json(reviewInDb);
  } else {
    res.status(404).json({
      message: "Review can not be found.",
    });
  }
});

//Delete a Review
router.delete("/:id", requireAuth, async (req, res, next) => {
  const reviewId = req.params.id;
  const review = await Review.findByPk(reviewId);
  if (isNaN(reviewId)) {
    res.status(400).json("id has to be a number");
  }
  if (review) {
    await review.destroy();
    res.json("Successfully deleted");
  } else {
    res.status(404).json({
      message: "Review can not be found.",
    });
  }
});
module.exports = router;
