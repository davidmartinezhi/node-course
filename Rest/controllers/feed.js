const { validationResult } = require("express-validator");

const Post = require("../models/post");

module.exports = class ControllerFeed {
  static getPosts = (req, res, next) => {
    // we return a json object with a posts array that contains an object with a title and content
    res.status(200).json({
      posts: [
        {
          _id: "1",
          title: "First Post",
          content: "This is the first post!",
          imagerUrl: "images/dog.png",
          creator: { name: "David" },
          createdAt: new Date(),
        },
      ],
    });
  };

  static createPost = async (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    //validate input errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation failed, entered data is incorrect.",
        errors: errors.array(),
      });
    }

    try {

      //Create new post
      const post = await new Post({
        title: title,
        content: content,
        imageUrl: "images/dog.png",
        creator: { name: "David" },
      });

        const result = await post.save(); // this will save the post in the database

      // 201 is the status code for created, return the post
      res.status(201).json({
        // 201 is the status code for created
        message: "Post created successfully!",
        post: post,
      });
    } catch (err) {
        console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
};
