const express = require("express");
const authController = require("../controllers/auth");
const User = require("../models/user");
const { check } = require("express-validator");
const bcrypt = require("bcryptjs"); // this will import the bcryptjs package

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (!userDoc) {
            return Promise.reject("No account with this email found.");
          }
        });
      }),
    check("password")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
      .withMessage("Password is invalid")
      .custom((value, { req }) => {
        return User.findOne({ email: req.body.email }).then((userDoc) => {
          return bcrypt.compare(value, userDoc.password).then((doMatch) => {
            if (!doMatch) {
              return Promise.reject("Password incorrect. Please try again.");
            }
          });
        });
      }),
  ],
  authController.postLogin
);

// check() function is a middleware to validate the input fields
// we can pass array of variables to check or just one variable
// isEmail() is a method to check if the input is an email
// middleware uses the variable and checks everywhere for it, query, headers, cookies, etc.
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          //if promise is rejected, the promise will be rejected with the error message
          // else it will be resolved with no value meaning it was successful
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      }), // custom() is a method to create a custom validation
    check(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }), // custom() is a method to create a custom validation
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
