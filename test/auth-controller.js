const expect = require("chai").expect;
const sinon = require("sinon");

const User = require("../models/user");

const AuthController = require("../controllers/auth");

// Obs: Passing arrow functions (aka “lambdas”) to Mocha is discouraged.
// Lambdas lexically bind this and cannot access the Mocha context.

describe("Auth Controller - Login", function () {
  it("should throw an error with code 500 if accessing the database fails using the done argument", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.throws(); // We can use this to make findOne throws an error

    const req = {
      body: {
        email: "test@test.com",
        password: "12345",
      },
    };

    // Take care with async code, you could have a false pass. Mocha doesnt wait for the
    // test case to finish because we actually have async code, by default it does not
    // wait for async code to resolve. It executes the code synchronously step by step
    // and does not wait for a promise to resolve no matter how fast your async code is.
    // To handle this you should add the "done" argument or transform the function passed to
    // it() in async and use await
    AuthController.login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);

        // Here we signal that I want Mocha to wait this code to
        // execute before it treats this test case as done.
        done();
      })
      .catch((err) => {
        // expect() can throws an error and the done() above never gets executed if the statusCode != 500 for example
        // And then we can have a timeout error here if this happens. So we need to catch this err here and use done(err)
        // https://stackoverflow.com/questions/16607039/in-mocha-testing-while-calling-asynchronous-function-how-to-avoid-the-timeout-er
        // https://github.com/mochajs/mocha/issues/1128
        // The async/await approach is better to understand
        done(err);
      });

    User.findOne.restore();
  });

  it("should throw an error with code 500 if accessing the database fails using async/await", async function () {
    sinon.stub(User, "findOne");
    User.findOne.throws(); // We can use this to make findOne throws an error

    const req = {
      body: {
        email: "test@test.com",
        password: "12345",
      },
    };

    const result = await AuthController.login(req, {}, () => {});
    expect(result).to.be.an("error");
    expect(result).to.have.property("statusCode", 500);

    User.findOne.restore();
  });
});
