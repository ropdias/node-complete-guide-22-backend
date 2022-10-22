const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

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

  it("should yield a userId after decoding the token", () => {
    const req = {
      get: () => {
        return "Bearer xyz"; // This will certainly be an incorrect token.
      },
    };
    // jwt.verify = () => {
    //   return { userId: "abc" };
    // };
    // Replacing globaly directly a function is not ideal because another test could fail
    // if it needs the original behaviour. So we should use packages (like sinon) to manage that.
    sinon.stub(jwt, "verify"); // The object which has the method and the method to replace as a string
    // With just that it will actually replace it with an empty function and will do things
    // like registering function calls and so on, so that you can also test for things
    // like "has this function be called no matter what it executes?"
    // But in here we will use like this:
    jwt.verify.returns({ userId: "abc" });

    // Here we are executing the function manually so req can receive a new property
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId"); // Checking if req has a property named userId
    expect(req).to.have.property("userId", "abc"); // Checking if the value of userId is "abc"
    expect(jwt.verify.called).to.be.true; // to check if the jwt.verify method has been called

    // We need to restore the behaviour of the function we used stub:
    jwt.verify.restore();
  });

  it("should throw an error if the token cannot be verified", () => {
    const req = {
      get: () => {
        return "Bearer xyz"; // This will certainly be an incorrect token.
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
