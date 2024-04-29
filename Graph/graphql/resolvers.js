const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const User = require("../models/user");
const Post = require("../models/post");

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
    // validations
    const errors = []; // to store errors
    if (!validator.isEmail(email)) {
      // validate email
      errors.push({ message: "E-Mail is invalid." });
    }
    if (
      // validate password
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
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

  createPost: async function ({ postInput }, req) {
    // check if the user is authenticated
    if (req.isAuth === false) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    // input validations
    const errors = []; // to store errors
    if (
      // validate title
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({
        message: "Title is invalid. It must have at least 5 characters",
      });
    }
    if (
      // validate content
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({
        message: "Content is invalid. It must have at least 5 characters",
      });
    }

    // if there are errors, throw an error
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    // find the user by id
    const user = await User.findById(req.userId);

    // if user does not exist, throw an error
    if (!user) {
      const error = new Error("Invalid user.");
      error.code = 401;
      throw error;
    }

    // create a new post
    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: user,
    });

    // save the post
    const createdPost = await post.save(); // save the post

    // push the post to the user posts
    user.posts.push(post);
    await user.save(); // save the user

    // return the created post
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },

  posts: async function (args, req) {
    // Check user authentication
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    //const currentPage = req.query.page || 1; // extract the page from the request
    //const perPage = 2; // set the number of posts per page
    const totalPosts = await Post.find().countDocuments(); // count the number of posts

    // get all posts
    const posts = await Post.find()
      .populate("creator") // populate the creator field
      .sort({ createdAt: -1 }); // sort the posts by createdAt in descending order
    //.skip((currentPage - 1) * perPage) // skip the number of posts based on the page and perPage
    //.limit(perPage); // amount of posts to return per page

    // if there are no posts, throw an error
    if (!posts) {
      const error = new Error("Could not find posts.");
      error.statusCode = 404;
      throw error;
    }

    let postsData = posts.map((p) => {
      return {
        ...p._doc, // spread operator to copy all properties of the post
        _id: p._id.toString(), // convert the id to string
        createdAt: p.createdAt.toISOString(), // convert the createdAt to string
        updatedAt: p.updatedAt.toISOString(), // convert the updatedAt to string
      };
    });

    // return the posts
    return { posts: postsData, totalPosts: totalPosts };
  },
};
