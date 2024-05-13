const expect = require("chai").expect;
const io = require("../socket");
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const FeedController = require("../controllers/feed");

// Integration test example with a real database
describe("Feed Controlles - User Create Post", function () {
  before(async function () {
    try {
      // Connect to the database
      await mongoose.connect(
        "mongodb+srv://david:dZiATPxy4lpvAc0e@cluster0.7pba9hx.mongodb.net/test-messages?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true }
      );
      // Create a user
      const user = new User({
        email: "test@test.com",
        password: "password",
        name: "test",
        posts: [],
        _id: "5c0f66b979af55031b34728a",
      });
      // Save the user
      await user.save();
    } catch (error) {
      // Log the error
      console.error("Setup failed:", error);
      // Optionally, you can force the test suite to stop
      throw new Error("Failed to set up test environment");
    }
  });

  after(async function () {
    try {
      // Delete users and disconnect
      await User.deleteMany({});
      await mongoose.disconnect();
    } catch (error) {
      console.error("Teardown failed:", error);
      throw error; // Rethrow to signal an issue during teardown
    }
  });

  //beforeEach(function () {});
  //afterEach(function () {});

  it("Should add a created post to the posts of the creator", async () => {
    // Prepare request object
    const req = {
      body: {
        title: "Test Post",
        content: "This is a test post",
        // creator: "5c0f66b979af55031b34728a",
        // imageUrl: "images/test.jpg",
      },
      file: {
        path: "images/test.jpg",
      },
      userId: "5c0f66b979af55031b34728a",
    };

    // Mock the response object
    const res = {
      statusCode: 0,
      body: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.body = data;
      },
    };

    // Stub the io.getIO function
    sinon.stub(io, "getIO");
    io.getIO.returns({ emit: () => {} });

    try {
      // Call the function that handles the request
      await FeedController.createPost(req, res, () => {});

      // Assert on the response
      expect(res.statusCode).to.equal(201); // 201 is the status code for created
      expect(res.body).to.have.property("post"); // Ensure the response has a post property
      expect(res.body.post).to.include({
        title: "Test Post",
        content: "This is a test post",
      });
      expect(res.body.post.creator.toString()).to.equal(req.userId); // Ensure the creator is the same as the userId

    //   const savedUser = await FeedController.createPost(req, res, () => {});
    //   expect(savedUser).to.have.property("posts");
    //   expect(savedUser.posts).to.have.length(2);
    } catch (err) {
      console.error("Test execution failed:", err);
      throw new Error("Test failed due to an unexpected error");
    } finally {
      // Restore the stub
      io.getIO.restore();
    }
  });
});
