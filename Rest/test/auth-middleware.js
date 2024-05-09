const expect = require("chai").expect;
const authMiddleware = require("../middleware/is-auth");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

// describe is a function that takes two arguments, a string and a function
// the string is the name of the test suite (this groups tests)
// it is possible to have a describe inside a describe and have there our test cases

describe("Auth Middleware", () => {
  it("Should throw an error if no authorization header is present", () => {
    // req.get is a function that returns the value of the header
    const req = {
      get: (headerName) => {
        // get function that returns undefined
        return null; // no header present
      },
    };

    // expect the function to throw an error
    expect(() =>
      authMiddleware(
        req, // pass the request with no header
        {}, // pass an empty object for response
        () => {} // pass an empty function for next
      )
    ).to.throw("Not authenticated.");
  });

  it("should throw an error if the authorization header is only one string", () => {
    const req = {
      get: (headerName) => {
        return "xyz"; // only one string
      },
    };

    // expect the function to throw an error, we dont care about the message
    expect(() => authMiddleware(req, {}, () => {})).to.throw();
  });

  it("should throw an error if the token cannot be verified", () => {
    const req = {
      get: (headerName) => {
        return "Bearer xyz"; // token is not valid
      },
    };

    // expect the function to throw an error
    expect(() => authMiddleware(req, {}, () => {})).to.throw();
  });

  it("should yield a userId after decoding the token", () => {
    const req = {
      get: (headerName) => {
        return "Bearer jajajjajaka"; // token is not valid
      },
    };

    // jwt.verify is a function that returns the decoded token
    // we are mocking the function to return a userId, we override the function
    // This is a stub, we are not testing the jwt.verify function
    // overriding the function modifies it globally, which is not a good practice
    // we should use a library like sinon to stub functions
    // jwt.verify = () => { // before sinon
    //     return { userId: "abc" }; // return a userId
    //   };

    sinon.stub(jwt, "verify"); // stub the function. by default it replaces it with empty function and registers function calls
    jwt.verify.returns({ userId: "abc" }); // return a userId. we configure what we want the function to return

    // call the middleware
    authMiddleware(req, {}, () => {});

    // expect the request to have a userId property
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");

    // to know if the function was called
    expect(jwt.verify.called).to.be.true; // expect the function to be called, this is a sinon function

    // restore the function to its original state
    jwt.verify.restore();
  });
});
