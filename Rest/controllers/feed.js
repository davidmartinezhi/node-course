const { validationResult } = require("express-validator");

const Post = require("../models/post");

module.exports = class ControllerFeed {
  static getPosts = async (req, res, next) => {
    try {
      const posts = await Post.find();

      if (!posts) {
        const error = new Error("Could not find posts.");
        error.statusCode = 404;
        next(error); // this will throw an error
      }

      res.status(200).json({
        message: "Fetched posts successfully.",
        posts: posts,
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
        next(error); // this will throw an error
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

      //Create new post
      const post = await new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: { name: "David" },
      });

      if (!post) {
        const error = new Error("Could not create post.");
        error.statusCode = 404;
        next(error); // this will throw an error
      }

      const savedPost = await post.save(); // this will save the post in the database

      if (!savedPost) {
        const error = new Error("Could not save post.");
        error.statusCode = 404;
        next(error); // this will throw an error
      }

      // 201 is the status code for created, return the post
      res.status(201).json({
        // 201 is the status code for created
        message: "Post created successfully!",
        post: post,
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
};
