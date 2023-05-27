const express = require("express");
const bcrypt = require("bcryptjs");
const { ValidationError } = require("sequelize");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();
const meRouter = require("./me.js");
const spotRouter = require("./spots");

router.use(
  "/me/spots",
  requireAuth,
  (req, res, next) => {
    req.ownerId = req.user.id;
    next();
  },
  spotRouter
);

router.use("/me", meRouter);

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First Name is required."),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// Sign up
router.post("/", validateSignup, async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  let user;
  try {
    user = await User.create({
      email,
      username,
      hashedPassword,
      firstName,
      lastName,
    });
  } catch (err) {
    let errors = {};
    let hasUniqueVio = false;
    if (!err instanceof ValidationError) {
      throw err;
    }
    err.errors.forEach((e) => {
      if (e.type === "unique violation") {
        hasUniqueVio = true;
        return (errors[e.path] = `User with that ${e.path} already exists`);
      }
    });
    if (hasUniqueVio) {
      return res.status(500).json({
        message: "User already exists",
        errors,
      });
    } else {
      throw err;
    }
  }
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

module.exports = router;
