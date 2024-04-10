

module.exports = class ControllerFeed{

    static getPosts = (req, res, next) => {
        // we return a json object with a posts array that contains an object with a title and content
        res.status(200).json({
            posts: [{ title: "First Post", content: "This is the first post!" }],
        });
    };

    static createPost = (req, res, next) => {
        const title = req.body.title;
        const content = req.body.content;
        // Create post in db
        res.status(201).json({ // 201 is the status code for created
            message: "Post created successfully!",
            post: { id: new Date().toISOString(), title: title, content: content },
        });
    };
}