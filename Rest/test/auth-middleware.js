const expect = require("chai").expect;
const authMiddleware = require("../middleware/is-auth");

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
});
