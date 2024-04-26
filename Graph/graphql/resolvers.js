const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const User = require("../models/user");

module.exports = {
  createUser: async function ({ userInput }, req) {
    // const email = args.userInput.email;

    // validations
    const errors = []; // to store errors

    // validate email
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "E-Mail is invalid." });
    }

    // validate password
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password too short!" });
    }

    // if there are errors, throw an error
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    // check if user already exists
    const existingUser = await User.findOne({ email: userInput.email });

    // if user exists, throw an error
    if (existingUser) {
      const error = new Error("User exists already!");
      throw error;
    }

    // hash the password
    const hashedPw = await bcrypt.hash(userInput.password, 12);

    // create a new user
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw,
    });

    // save the user
    const createdUser = await user.save();
    // ...createdUser._doc is a spread operator that copies all properties of createdUser._doc to a new object
    // it is used to remove the metadata from the object and only return the actual data
    return { ...createdUser._doc, _id: createdUser._id.toString() }; // return the created user
  },

  login: async function ({ email, password }) {
    // find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      // if user does not exist throw error
      const error = new Error("A user with this email could not be found.");
      error.code = 401;
      throw error;
    }

    // check if the password is correct
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      // if password is incorrect, throw an error
      const error = new Error("Wrong password!");
      error.code = 401;
      throw error;
    }

    // create a token
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );

    // return the token and the user id
    return { token: token, userId: user._id.toString() };
  },
};
