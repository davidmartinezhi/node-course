const { validationResult } = require("express-validator");

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

  static createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;

    //validate input errors
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation failed, entered data is incorrect.",
        errors: errors.array()
      });
    }

    // Create post in db
    res.status(201).json({
      // 201 is the status code for created
      message: "Post created successfully!",
      post: {
        _id: new Date().toISOString(),
        title: title,
        content: content,
        creator: { name: "David" },
        createdAt: new Date(),
      },
    });
  };
};
