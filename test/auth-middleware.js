const expect = require("chai").expect;

const authMiddleware = require("../middleware/is-auth");

describe("Auth middleware", () => {
  // describe(); // You could have a describe inside a describe
  it("should throw an error if no authorization header is present", () => {
    const req = {
      get: () => {
        return null;
      },
    };
    // We are preparing the function to be called instead of calling it directly by using bind
    // We are passing as arguments:
    // 1) the "req" we created;
    // 2) an empty object for the "res";
    // 3) and an empty function for the "next" function;
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated."
    );
  });

  it("should throw an error if the authorization header is only one string", () => {
    const req = {
      get: () => {
        return "xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
