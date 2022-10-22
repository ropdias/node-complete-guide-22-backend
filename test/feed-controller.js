const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");

const FeedController = require("../controllers/feed");

describe("Feed Controller - User Status", function () {
  it("should send a response with a valid user status for an existing user", async function () {
    mongoose
      .connect(process.env.TEST_MONGODB_URI)
      .then((result) => {
        const user = new User({
          email: "test@test.com",
          password: "tester",
          name: "Test",
          posts: [],
        });
        return user.save();
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  });
});
