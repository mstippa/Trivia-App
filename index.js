const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { MONGODB, PORT } = require("./config");

const {
  getUsers,
  login,
  registerUser,
  getUser,
  updateUserScore,
  setQuestionAnswered,
} = require("./app/users");
const {
  getQuestion,
  getQuestions,
  answerTriviaQuestion,
  answerFollowUpQuestion,
} = require("./app/questions");
const auth = require("./util/check-authentication");

// start up an express server
const app = express();

// used to read request body
app.use(express.json());
app.use(express.urlencoded());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
  next();
});

// check if user is logged in before a request is made
app.use(auth);

app.use(cors());

// TODO handle routing in another file
// TODO think about another way to handle requests
// routes
app.get("/", (req, res) => {
  getQuestion(req.query.questionId).then((question) => res.send(question));
});
app.post("/", (req, res) => {
  // if the trivia question was answered we are then answering the follow up question
  if (req.body.answeredQuestion) {
    answerFollowUpQuestion(req.body, req.userId).then((response) =>
      res.send(response)
    );
  } else {
    answerTriviaQuestion(req.body, req.userId).then((response) => {
      if (response.correct) updateUserScore(response.userId);

      // need to return a new token because we need the browser to rememeber that the user answered the daily trivia question
      // const newToken = setQuestionAnswered(req.userId);
      setQuestionAnswered(req.userId).then((newToken) => {
        const userResponse = { ...response, newToken };
        res.send(userResponse);
      });
    });
  }
});
app.get("/users", (req, res) => {
  getUsers().then((users) => res.send(users));
});
app.get("/user", (req, res) => {
  getUser(req.userId).then((user) => res.send(user));
});
app.get("/questions", (req, res) => {
  getQuestions().then((questions) => res.send(questions));
});
app.post("/login", (req, res) => {
  // login(req.body).then((result) => res.json(result));
  login(req.body, res);
});
app.post("/register", (req, res) => {
  registerUser(req.body).then((token) => res.send(token));
});

// connect to the MONGODB database
// once connected fetch a question from the trivia qpi and add it to our databsae
mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useFindAndModify", false);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  app.listen(PORT);
});
