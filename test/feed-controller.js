require("dotenv").config();
const expect = require("chai").expect;
const mongoose = require("mongoose");

const User = require("../models/user");
const FeedController = require("../controllers/feed");

describe("Feed Controller - User Status", function () {
  // This is called a "hook" to be executed before all test cases
  before(async function () {
    await mongoose.connect(process.env.TEST_MONGODB_URI);
    const user = new User({
      email: "test@test.com",
      password: "tester",
      name: "Test",
      posts: [],
      _id: "5c0f66b979af55031b34728a",
    });
    await user.save();
  });

  // This is called a "hook" to be executed after all test cases
  after(async function () {
    await User.deleteMany({}); // Cleaning the data we saved in the database so we can test again later
    await mongoose.disconnect(); // Disconnecting from the database
  });

  // The function below is useful if you need to reset something before every
  // test case or if you want to have some initialization
  // work that absolutely has to run before after every test case
  // beforeEach(function () {}); // beforeEach is repeated before each test

  // The function below is useful if you have to do some clean up after each test
  // afterEach(function () {}); // afterEach is repeated after each test

  it("should send a response with a valid user status for an existing user", async function () {
    const req = { userId: "5c0f66b979af55031b34728a" }; // If you pass a userId it's like if you are authenticated
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this; // we need to return a reference to this object so we can call .json() later
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    // getUserStatus is an async function and implicitly returns a promise
    await FeedController.getUserStatus(req, res, () => {});
    expect(res.statusCode).to.be.equal(200);
    expect(res.userStatus).to.be.equal("I am new!");
  });

  it("should add a created post to the posts of the creator", async function () {
    const req = {
      body: {
        title: "Test Post",
        content: "A Test Post",
      },
      file: {
        path: "abc",
      },
      userId: "5c0f66b979af55031b34728a", // If you pass a userId it's like if you are authenticated
    };
    const res = {
      status: function () {
        return this; // we need to return a reference to this object so we can call .json() later
      },
      json: function () {},
    };

    const savedUser = await FeedController.createPost(req, res, () => {});
    expect(savedUser).to.have.property("posts");
    expect(savedUser.posts).to.have.length(1);
  });
});
