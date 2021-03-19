const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const { SECRET_KEY } = require("../config");
const { response } = require("express");

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
    },
    SECRET_KEY,
    { expiresIn: "2h" }
  ));
}

module.exports = {
  async getUsers() {
    const users = await User.find({}, "username score");
    return users;
  },
  async getUser(id) {
    console.log(id);
    try {
      const user = await User.findById(id);
      return user;
    } catch {
      return {
        error: "Cannot Retrieve Stats",
      };
    }
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

      return { token, username };
    } catch (error) {
      return {
        error: "Incorrect Credentials",
      };
    }
  },
  async registerUser({ fname, lname, username, password }) {
    const user = await User.findOne({ username });
    if (user) {
      return {
        message: "Username is taken",
      };
    }

    password = await bcrypt.hash(password, 10);

    const newUser = new User({ fname, lname, username, password, score: 0 });
    try {
      newUser.save();
    } catch (error) {
      return {
        message: "Cannot create user",
      };
    }

    const token = generateToken(newUser);

    return { token, username };
  },
};
