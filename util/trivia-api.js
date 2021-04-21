const axios = require("axios");

const { insertQuestion } = require("../app/questions");

module.exports = () => {
  return axios
    .get("https://opentdb.com/api.php?amount=1&category=22&type=multiple")
    .then((response) => response.data.results[0])
    .then((question) => insertQuestion(question))
    .then((newQuestion) => newQuestion)
    .catch((error) => error);
};
