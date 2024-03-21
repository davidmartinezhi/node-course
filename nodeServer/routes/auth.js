const express = require("express");
const authController = require("../controllers/auth");
const { check } = require("express-validator");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

// check() function is a middleware to validate the input fields
// we can pass array of variables to check or just one variable
// isEmail() is a method to check if the input is an email
// middleware uses the variable and checks everywhere for it, query, headers, cookies, etc.
router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Please enter a valid email."),
    check(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
