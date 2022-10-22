const expect = require("chai").expect;
const sinon = require("sinon");

const User = require("../models/user");

const AuthController = require("../controllers/auth");

describe("Auth Controller - Login", () => {
  it("should throw an error with code 500 if accessing the database fails", () => {
    sinon.stub(User, "findOne");
    User.findOne.throws(); // We can use this to make findOne throws an 
    
    expect(AuthController.login)

    User.findOne.restore();
  });
});
