const Question = require("../models/Question");
const QuestionUser = require("../models/QuestionUser");

module.exports = {
  async getQuestions() {
    try {
      const questions = await Question.find();
      if (!questions) {
        throw new Error();
      }
      return questions;
    } catch {
      return {
        error: "Cannot get questions",
      };
    }
  },
  async insertQuestion({
    question: text,
    correct_answer: correctAnswer,
    incorrect_answers: incorrectAnswers,
  }) {
    const newQuestion = new Question({ text, correctAnswer, incorrectAnswers });
    try {
      await newQuestion.save();
      return newQuestion;
    } catch (error) {
      return {
        message: "Cannot get Question",
      };
    }
  },
  async answerTriviaQuestion({ answer, id }, userId) {
    try {
      const question = await Question.findById(id);
      if (question) {
        if (question.correctAnswer.trim() === answer.trim()) {
          return {
            correct: true,
            userId,
            questionId: id,
          };
        }

        return {
          correct: false,
          correctAnswer: question.correctAnswer,
          userId: user.id,
          questionId: id,
        };
      }
    } catch (err) {
      return {
        error: "Cannot Get Question",
      };
    }
  },
  async answerFollowUpQuestion({
    correct,
    userId,
    questionId,
    knewAnswer,
    educatedGuess,
    randomGuess,
  }) {
    const questionUser = new QuestionUser({
      correct,
      userId,
      questionId,
      knewAnswer,
      educatedGuess,
      randomGuess,
      time: new Date().toISOString(),
    });

    try {
      await questionUser.save();
      return questionUser;
    } catch {
      return {
        error: "Problem Connecting With The Database. Try Again Later.",
      };
    }
  },
};
