const { SECRET_KEY } = require("../config");
const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  if (request.path === "/login" || request.path === "/register") {
    return next();
  }

  const authHeader = request.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        request.userId = user.id;
        return next();
      } catch (err) {
        console.log(err);
        response.send({ message: err });
        return;
      }
    }
    return {
      message: "Authentication token is incorrect",
    };
  }
  return response.send({
    error: "incorrect authorization error",
  });
};
