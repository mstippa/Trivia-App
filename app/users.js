const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const { SECRET_KEY } = require("../config");
const triviaApi = require("../util/trivia-api");

// generate a login token for a user when they login
function generateToken(user) {
  return (token = jwt.sign(
    {
      id: user.id,
      password: user.password,
      username: user.username,
      fname: user.fname,
      lname: user.lname,
      score: user.score,
      currentQuestionId: user.currentQuestionId,
      questionAnswered: user.questionAnswered,
    },
    SECRET_KEY,
    { expiresIn: "72h" }
  ));
}

// checks if x number of hours have passed since the user's daily trivia question was fetched
function checkQuestionExpiration(date) {
  const numberOfHours = 20;
  console.log(
    "current time minus time when question was answered",
    new Date().getTime() - date
  );
  console.log("other number", numberOfHours * 60 * 60 * 1000);
  return new Date().getTime() - date > numberOfHours * 60 * 60 * 1000;
}

module.exports = {
  async getUsers() {
    const users = await User.find({}, "username score");
    return users;
  },
  async getUser(id) {
    try {
      const user = await User.findById(id);
      return user;
    } catch {
      return {
        error: "Cannot Retrieve Stats",
      };
    }
  },
  async setQuestionAnswered(id) {
    const user = await User.findById(id);
    await user.updateOne({ questionAnswered: true });
    user.save();

    const newToken = generateToken(user);
    return newToken;
  },
  async updateUserScore(id) {
    try {
      const user = await User.findById(id);
      await user.updateOne({ score: user.score + 1 });
      user.save();
    } catch (err) {
      return {
        error: "Cannot find User",
      };
    }
  },
  async login({ username, password }, res) {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }

      const doPasswordsMatch = await bcrypt.compare(password, user.password);
      if (!doPasswordsMatch) {
        throw new Error("Incorrect Password");
      }

      const token = generateToken(user);

      const { currentQuestionId, currentQuestionTime, questionAnswered } = user;

      const isQuestionExpired = currentQuestionTime
        ? checkQuestionExpiration(currentQuestionTime)
        : true;

      if (!isQuestionExpired) {
        return res.send({
          token,
          username,
          currentQuestionId,
          questionAnswered,
        });
      }

      const triviaQuestion = await triviaApi();

      const { _id } = triviaQuestion;

      await User.findOneAndUpdate(
        { _id: user._id },
        {
          currentQuestionId: _id,
          currentQuestionTime: new Date().getTime(),
          questionAnswered: false,
        }
      );

      return res.send({ token, username, _id, questionAnswered });
    } catch (error) {
      return res.send({ error: "Incorrect credentials" });
    }
  },
  async registerUser({ fname, lname, username, password }) {
    const user = await User.findOne({ username });
    if (user) {
      return {
        error: "Username is taken",
      };
    }

    password = await bcrypt.hash(password, 10);

    const triviaQuestion = await triviaApi();

    try {
      const newUser = new User({
        fname,
        lname,
        username,
        password,
        score: 0,
        currentQuestionId: triviaQuestion._id,
        currentQuestionTime: new Date().getTime(),
        questionAnswered: false,
      });
      newUser.save();

      const token = generateToken(newUser);

      const { currentQuestionId } = newUser;

      return { token, username, currentQuestionId, questionAnswered: false };
    } catch (error) {
      return {
        error: "Cannot create user",
      };
    }
  },
};
