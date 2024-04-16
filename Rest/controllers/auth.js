const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

module.exports = class ControllerAuth {
  static async signup(req, res, next) {
    try {
      // Validate input errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error(
          "Validation failed, entered data is incorrect."
        );
        error.statusCode = 422;
        error.data = errors.array(); // this will store the errors in the error object
        throw error;
      }

      // Extract data from the request
      const email = req.body.email;
      const name = req.body.name;
      const password = req.body.password;
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create a new user
      const user = new User({
        email: email,
        name: name,
        password: hashedPassword,
      });

      // Save the user
      const savedUser = await user.save();

      res.status(201).json({ message: "User created!", userId: savedUser._id });
    } catch (err) {
      err.statusCode = 500 || err.statusCode;
      next(err);
    }
  }
};
