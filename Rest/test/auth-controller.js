const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth Controller", function () {
  before(function (done) {
    mongoose
      .connect(
        "mongodb+srv://david:dZiATPxy4lpvAc0e@cluster0.7pba9hx.mongodb.net/test-messages?retryWrites=true&w=majority", // this will connect to the database
        { useNewUrlParser: true, useUnifiedTopology: true }
      )
      .then((result) => {
        const user = new User({
          email: "test@test.com",
          password: "password",
          name: "test",
          posts: [],
          _id: "5c0f66b979af55031b34728a",
        });

        return user.save();
      })
      .then(() => {
        done();
      });
  });

  after(function (done) {
    User.deleteMany({}).then(() => {
      return mongoose.disconnect().then(() => done());
    });
  });

  //beforeEach(function () {});
  //afterEach(function () {});

  it("Should throw an error with status code 500 if accessing the database fails", (done) => {
    const req = {
      body: {
        email: "test@test.com",
        password: "testing",
      },
    };

    const findOneStub = sinon.stub(User, "findOne");
    findOneStub.throws();

    AuthController.login(req, {}, (err) => {
      try {
        expect(err).to.be.instanceOf(Error);
        expect(err).to.have.property("statusCode", 500);
        expect(findOneStub.called).to.be.true;
        done();
      } catch (err) {
        done(err);
      } finally {
        findOneStub.restore();
      }
    });
  });

  it("Should send a response with a valid user status for an existing user", (done) => {
    req = { userId: "5c0f66b979af55031b34728a" };
    res = {
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

    AuthController.getUserStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("I am new!");
      done();
    });
  });
});