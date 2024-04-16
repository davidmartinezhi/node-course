const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");

const Post = require("../models/post");

module.exports = class ControllerFeed {
  static getPosts = async (req, res, next) => {
    try {
      const currentPage = req.query.page || 1; // extract the page from the request
      const perPage = 2; // set the number of posts per page
      const totalItems = await Post.find().countDocuments(); // count the number of posts


      const posts = await Post.find() // find all the posts based on the page and perPage
      .skip((currentPage - 1) * perPage)  // skip the number of posts based on the page and perPage
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

      //Create new post
      const post = await new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: { name: "David" },
      });

      await post.save(); // this will save the post in the database

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
      let post = await Post.findByIdAndUpdate(postId);

      // if post is not found
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        // next(error); // this will throw an error
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

      await post.save(); // save the post

      // return a json object with a message and the updated post
      res.status(200).json({
        message: "Post updated!",
        post: post,
      });
    } catch (err) {
      err.statusCode = err.statusCode || 500; // Assign a default error status code if not already set
      next(err); // this will throw an error
    }
  };

  static deletePost = async (req, res, next) => {
    try {
      const postId = req.params.postId; // extract postId from the request

      const post = await Post.findById(postId); // find the post by id

      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        // next(error); // this will throw an error
        throw error;
      }

      await Post.findByIdAndDelete(postId); // remove the post by id
      this.clearImage(post.imageUrl); // clear the post image

      res.status(200).json({ message: "Deleted post." }); // return a json object with a message
    } catch (err) {
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
