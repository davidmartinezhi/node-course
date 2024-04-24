const bcrypt = require("bcryptjs");
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
};
