const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  fname: String,
  lname: String,
  score: Number,
  password: String,
  username: String,
});

module.exports = model("User", userSchema);
