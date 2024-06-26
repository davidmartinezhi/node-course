const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

// Unit test example with a stub
describe("Auth Controller - Login", function () {
    it("Should handle errors with status code 500 if accessing the database fails", async () => {
        // Prepare request object
        const req = {
          body: {
            email: "test@test.com",
            password: "testing",
          },
        };
    
        // Mock the response and next function
        const res = {}; // Mock response object if needed
        const next = sinon.spy(); // Spy on the next function
    
        // Stub the User.findOne to simulate database failure
        const findOneStub = sinon.stub(User, "findOne");
        findOneStub.throws(new Error("Database access failed"));
    
        // Call the function that handles the request
        await AuthController.login(req, res, next);
    
        // Check if the next function was called with an error
        expect(next.called).to.be.true;
        expect(next.firstCall.args[0]).to.be.an.instanceof(Error);
        expect(next.firstCall.args[0].message).to.equal("Database access failed");
        expect(next.firstCall.args[0]).to.have.property("statusCode", 500);
        expect(findOneStub.called).to.be.true; // Ensure the stub was called
    
        // Restore the stubbed function
        findOneStub.restore();
      });
});

// Integration test example with a real database
describe("Auth Controller - User Status", function () {
  before(async function () {
    await mongoose.connect(
      "mongodb+srv://david:dZiATPxy4lpvAc0e@cluster0.7pba9hx.mongodb.net/test-messages?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const user = new User({
      email: "test@test.com",
      password: "password",
      name: "test",
      posts: [],
      _id: "5c0f66b979af55031b34728a",
    });
    await user.save();
  });

  after(async function () {
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  //beforeEach(function () {});
  //afterEach(function () {});

  it("Should send a response with a valid user status for an existing user", async () => {
    const req = { userId: "5c0f66b979af55031b34728a" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };

    await AuthController.getUserStatus(req, res, () => {});
    expect(res.statusCode).to.be.equal(200);
    expect(res.userStatus).to.be.equal("I am new!");
  });
});
