const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  fname: String,
  lname: String,
  score: Number,
  password: String,
  username: String,
  currentQuestionId: Schema.Types.ObjectId,
  currentQuestionTime: Number,
  questionAnswered: Boolean,
});

module.exports = model("User", userSchema);
