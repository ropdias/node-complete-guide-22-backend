require("dotenv").config();
const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");

const FeedController = require("../controllers/feed");

describe("Feed Controller - User Status", function () {
  it("should send a response with a valid user status for an existing user", async function () {
    try {
      await mongoose.connect(process.env.TEST_MONGODB_URI);
    } catch (error) {
      console.log(error);
    }
    const user = new User({
      email: "test@test.com",
      password: "tester",
      name: "Test",
      posts: [],
      _id: "5c0f66b979af55031b34728a",
    });
    await user.save();

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
    // getUserStatus is an async function and implicitly returns a promise
    await FeedController.getUserStatus(req, res, () => {});
    expect(res.statusCode).to.be.equal(200);
    expect(res.userStatus).to.be.equal("I am new!!");
  });
});
