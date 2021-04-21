const { Schema, model } = require("mongoose");

const questionUserSchema = new Schema({
  questionId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  correct: Boolean,
  time: Date,
  knewAnswer: Boolean,
  randomGuess: Boolean,
  educatedGuess: Boolean,
});

module.exports = model("QuestionUser", questionUserSchema);
