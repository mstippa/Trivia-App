import axios from "axios";

export const getQuestion = (token, questionId) => {
  return axios
    .get("http://localhost:8080/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        questionId: questionId,
      },
    })
    .then((response) => {
      const { data: question } = response;
      return question;
    });
};

export const answerQuestion = (token, ...reqBody) => {
  return axios
    .post("http://localhost:8080/", ...reqBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const { data } = response;
      return data;
    })
    .catch((error) => error);
};

export const login = (credentials) => {
  const loginResponse = axios
    .post("http://localhost:8080/login", { ...credentials })
    .then((response) => {
      const { data } = response;
      return data;
    })
    .catch((error) => error);

  return loginResponse;
};

export const getUsers = (token) => {
  return axios
    .get("http://localhost:8080/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const { data } = response;
      return data;
    })
    .catch((error) => error);
};

export const registerUser = (credentials) => {
  return axios
    .post("http://localhost:8080/register", { ...credentials })
    .then((response) => {
      const { data } = response;
      return data;
    })
    .catch((error) => error);
};
