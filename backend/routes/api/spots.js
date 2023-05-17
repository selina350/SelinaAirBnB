const express = require("express");
const router = express.Router();
const { Spot } = require("../../db/models");


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

module.exports = router;
