const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

  static async login(req, res, next) {
    try {
      // extract data from the request
      const email = req.body.email;
      const password = req.body.password;

      // find the user by email
      const user = await User.findOne({ email });

      // check if the user exists
      if (!user) {
        const error = new Error("A user with this email could not be found.");
        error.statusCode = 401; // 401 is the status code for unauthorized
        throw error;
      }

      const isEqual = bcrypt.compare(password, user.password);

      // check if the password is correct
      if (!isEqual) {
        const error = new Error("Wrong password.");
        error.statusCode = 401; // 401 is the status code for unauthorized
        throw error;
      }

      // create signature token
      const token = jwt.sign(
        {
          // this is the payload
          email: user.email, // this is the email of the user
          userId: user._id.toString(), // this is the id of the user
        },
        "somesupersecretsecret", // this is the secret key
        { expiresIn: "1h" } // this is the expiration time
        //token is stored in the client side and could be stolen, so it should be short-lived
      );

      return res
        .status(200)
        .json({ token: token, userId: user._id.toString() }); // return the token and the userId
    } catch (err) {
      console.log(err);
      err.statusCode = 500 || err.statusCode;
      next(err);
      //return(err);
    }
  }

  static async getUserStatus(req, res, next) {
    try {
      // if user if logged in, we can get the user id from the request
      const user = await User.findById(req.userId);

      // if user is not found
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404; // 404 is the status code for not found
        throw error;
      }

      // if we have a user, we return the status
      return res.status(200).json({ status: user.status });
    } catch (err) {
      err.statusCode = 500 || err.statusCode;
      next(err);
    }
  }

  static async updateUserStatus(req, res, next) {
    // Validate input errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array(); // this will store the errors in the error object
      throw error;
    }

    try {
      // extract the status from the request
      const newStatus = req.body.status;

      // find the user by id
      const user = await User.findById(req.userId);

      // if user is not found
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404; // 404 is the status code for not found
        throw error;
      }

      // update the status
      user.status = newStatus;
      await user.save();

      return res.status(200).json({ message: "User updated successfully." });
    } catch (err) {
      err.statusCode = 500 || err.statusCode;
      next(err);
    }
  }
};
