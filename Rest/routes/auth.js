const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const ControllerAuth = require("../controllers/auth");
const User = require("../models/user");

// PUT /auth/signup
router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        //return true if validation succeeds, else return promise that rejects with an error message
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            // return a rejected promise
            return Promise.reject("Email address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  ControllerAuth.signup
);

// POST /auth/login
router.post("/login", ControllerAuth.login);

module.exports = router;
