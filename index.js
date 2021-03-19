const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");

const { MONGODB, PORT } = require("./config");

const {
  getUsers,
  login,
  registerUser,
  getUser,
  updateUserScore,
} = require("./app/users");
const {
  getQuestions,
  insertQuestion,
  answerTriviaQuestion,
  answerFollowUpQuestion,
} = require("./app/questions");
const auth = require("./util/check-authentication");

// start up an express server
const app = express();

// used to read request body
app.use(express.json());
app.use(express.urlencoded());

// check if user is logged in before a request is made
app.use(auth);

// TODO handle routing in another file
// TODO think about another way to handle requests
// routes
app.get("/", (req, res) => {
  axios
    .get("https://opentdb.com/api.php?amount=1&category=22&type=multiple")
    .then((response) => {
      const question = response.data.results[0];
      insertQuestion(question).then((newQuestion) => res.send(newQuestion));
    })
    .catch((error) => {
      res.send({ error });
    });
});
app.post("/", (req, res) => {
  if (req.body.answeredQuestion) {
    answerFollowUpQuestion(req.body).then((response) => res.send(response));
  } else {
    answerTriviaQuestion(req.body, req.userId).then((response) => {
      if (response.correct) updateUserScore(response.userId);
      res.send(response);
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
  login(req.body).then((result) => res.json(result));
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
