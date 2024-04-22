const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const Post = require("../models/post");
const User = require("../models/user");

const io = require("../socket");

module.exports = class ControllerFeed {
  static getPosts = async (req, res, next) => {
    try {
      const currentPage = req.query.page || 1; // extract the page from the request
      const perPage = 2; // set the number of posts per page
      const totalItems = await Post.find().countDocuments(); // count the number of posts

      const posts = await Post.find() // find all the posts based on the page and perPage
        .populate("creator") // populate the creator field
        .sort({ createdAt: -1 }) // sort the posts by createdAt in descending order
        .skip((currentPage - 1) * perPage) // skip the number of posts based on the page and perPage
        .limit(perPage); // amount of posts to return per page

      if (!posts) {
        const error = new Error("Could not find posts.");
        error.statusCode = 404;
        next(error); // this will throw an error
      }

      res.status(200).json({
        message: "Fetched posts successfully.",
        posts: posts,
        totalItems: totalItems,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // this will throw an error
    }
  };

  static createPost = async (req, res, next) => {
    try {
      //validate input errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error = new Error(
          "Validation failed, entered data is incorrect."
        );
        error.statusCode = 422;
        error.data = errors.array(); // this will store the errors in the error object
        throw error; // this will throw an error
      }

      // Check if an image was provided
      if (!req.file) {
        const error = new Error("No image provided.");
        error.statusCode = 422;
        next(error); // this will throw an error
      }

      //Extract data from the request
      const title = req.body.title;
      const content = req.body.content;
      const imageUrl = req.file.path;
      const creator = req.userId; // extract the userId from the request, this is set on is-auth middleware

      //Create new post
      const post = await new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: creator,
      });

      await post.save(); // this will save the post in the database

      const user = await User.findById(creator); // find the user by id
      user.posts.push(post); // push the post to the user posts
      await user.save(); // save the user

      io.getIO().emit("posts", {
        action: "create",
        post: { ...post._doc, creator: { _id: req.userId, name: user.name } },
      }); // emit a new post event
      // emit send message to all connected message
      // boradcast sends message to all connected clients except the one that sent the message

      // 201 is the status code for created, return the post
      res.status(201).json({
        // 201 is the status code for created
        message: "Post created successfully!",
        post: post,
        creator: { _id: user._id, name: user.name },
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // this will throw an error
    }
  };

  static getPost = async (req, res, next) => {
    const postId = req.params.postId; // extract postId from the request

    try {
      const post = await Post.findById(postId); // find the post by id

      if (!post) {
        // if post is not found
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        next(error); // this will throw an error
      }

      // we return a json object with a post object that contains a title and content
      res.status(200).json({
        message: "Post fetched.",
        post: post,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // this will throw an error
    }
  };

  static updatePost = async (req, res, next) => {
    try {
      //validate input errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error = new Error(
          "Validation failed, entered data is incorrect."
        );
        error.statusCode = 422;
        error.data = errors.array(); // this will store the errors in the error object
        // next(error); // this will throw an error
        throw error;
      }

      // extract postId, title, content, and imageUrl from the request
      const postId = req.params.postId; // extract postId from the request
      const title = req.body.title; // extract title from the request
      const content = req.body.content; // extract content from the request
      let imageUrl = req.body.image; // extract imageUrl from the request, image is already stored in the database

      // Check if an image was provided, if we are not using an existing image
      if (req.file) {
        imageUrl = req.file.path;
      }

      if (!imageUrl) {
        const error = new Error("No file picked.");
        error.statusCode = 422;
        // next(error); // this will throw an error
        throw error;
      }

      // find the post by id
      let post = await Post.findById(postId).populate("creator"); 

      // if post is not found
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        // next(error); // this will throw an error
        throw error;
      }

      // if the user is not the creator of the post
      if (post.creator._id.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }

      // if imageUrl is different from the post imageUrl
      if (imageUrl !== post.imageUrl) {
        this.clearImage(post.imageUrl); // clear the post image
      }

      // update the post
      post.title = title; // update the title
      post.content = content; // update the content
      post.imageUrl = imageUrl; // update the imageUrl

      const result = await post.save(); // save the post

      io.getIO().emit("posts", { action: "update", post: result }); // emit an update post event

      // return a json object with a message and the updated post
      res.status(200).json({
        message: "Post updated!",
        post: result,
      });
    } catch (err) {
      err.statusCode = err.statusCode || 500; // Assign a default error status code if not already set
      next(err); // this will throw an error
    }
  };

  static deletePost = async (req, res, next) => {
    const session = await mongoose.startSession(); // Start a new session
    session.startTransaction(); // Start a transaction

    try {
      const postId = req.params.postId; // extract postId from the request

      const post = await Post.findById(postId).session(session); // find the post by id

      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        // next(error); // this will throw an error
        throw error;
      }

      // if the user is not the creator of the post
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }

      await Post.findByIdAndDelete(postId).session(session); // remove the post by id
      this.clearImage(post.imageUrl); // clear the post image

      // find the user by id
      const user = await User.findById(req.userId).session(session); // find the user by id
      user.posts.pull(postId); // remove the post from the user posts
      await user.save({ session }); // save the user

      // Commit the transaction
      await session.commitTransaction();
      session.endSession(); // End the session

      io.getIO().emit("posts", { action: "delete", post: postId }); // emit a delete post event
      res.status(200).json({ message: "Deleted post." }); // return a json object with a message
    } catch (err) {
      // If an error, abort the transaction and end session
      await session.abortTransaction();
      session.endSession();
      err.statusCode = err.statusCode || 500; // Assign a default error status code if not already set
      next(err);
    }
  };

  // Helper function to clear the image
  static clearImage = (filePath) => {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => console.log(err));
  };
};
