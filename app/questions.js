const Question = require("../models/Question");
const QuestionUser = require("../models/QuestionUser");

module.exports = {
  async getQuestion(id) {
    try {
      const question = await Question.findById(id);
      console.log("question", id);
      if (!question) throw new Error();
      return question;
    } catch {
      return {
        error: "Cannot Fetch Question. Try Again Later",
      };
    }
  },
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
        message: "Cannot Insert Question",
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

        const questionUser = new QuestionUser({
          correct: false,
          userId,
          questionId: id,
          knewAnswer: false,
          educatedGuess: false,
          randomGuess: false,
          time: new Date().toISOString(),
        });

        questionUser.save();

        return {
          correct: false,
          correctAnswer: question.correctAnswer,
          userId,
          questionId: id,
        };
      }
    } catch (err) {
      return {
        error: "Cannot Get Question",
      };
    }
  },
  async answerFollowUpQuestion(
    { correct, questionId, knewAnswer, educatedGuess, randomGuess },
    userId
  ) {
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
    } catch (err) {
      console.log(err);
      return {
        error: "Problem Connecting With The Database. Try Again Later.",
      };
    }
  },
};
