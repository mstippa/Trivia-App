const { Schema, model } = require("mongoose");

const questionSchema = new Schema({
  text: String,
  correctAnswer: String,
  incorrectAnswers: Array,
});

module.exports = model("Question", questionSchema);
