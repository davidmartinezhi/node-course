const expect = require("chai").expect;
const sinon = require("sinon");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth Controller - Login", function () {
  it("should throw an error with status code 500 if accessing the database fails", (done) => {
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
});
