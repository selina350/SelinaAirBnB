const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Spot, Review, Image, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateImage = [
  check("url").exists({ checkFalsy: true }).withMessage("url is required."),
  check("preview")
    .if((value, { req }) => {
      //example found https://express-validator.github.io/docs/api/validation-chain#if
      return req.spotId !== undefined;
    })
    .exists()
    .isBoolean({ strict: true })
    .withMessage("preview has to be true or false"),

  handleValidationErrors,
];

//Add an Image to a Spot or Review based on the Spot's id or Review's id
router.post("/", requireAuth, validateImage, async (req, res, next) => {
  const ownerId = parseInt(req.user.id);
  const { url } = req.body;
  const spotId = req.spotId;
  const reviewId = req.reviewId;

  let imageableType;
  let imageableId;
  let preview;
  if (spotId) {
    imageableType = "Spot";
    imageableId = spotId;
    preview = req.body.preview;
  }
  if (reviewId) {
    imageableType = "Review";
    imageableId = reviewId;
  }

  const image = await Image.create({
    imageableId,
    url,
    preview,
    imageableType,
  });
  const result = { id: image.id, url: image.url };
  if (image.imageableType === "Spot") {
    result.preview = image.preview;
  }
  res.json(result);
});

//delete a Spot or a Review Image
router.delete("/:id", requireAuth, async (req, res, next) => {
  const spotId = req.spotId;
  const reviewId = req.reviewId;
  const imageId = req.params.id;

  let imageableType;
  let imageableId;
  if (spotId) {
    imageableType = "Spot";
    imageableId = spotId;
  }
  if (reviewId) {
    imageableType = "Review";
    imageableId = reviewId;
  }

  if (isNaN(imageId)) {
    res.status(400).json({ message: "image id has to be a number" });
  }
  const image = await Image.findOne({
    where: {
      id: imageId,
      imageableId,
      imageableType,
    },
  });
  if (image) {
    await image.destroy();
    res.json("Successfully deleted");
  } else {
    res.status(404).json({
      message: "Image can not be found.",
    });
  }
});

module.exports = router;
