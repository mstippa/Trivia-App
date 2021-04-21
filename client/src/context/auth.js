import React, { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null,
};

// on page refresh see if the token is in local storage
if (localStorage.getItem("token")) {
  const decodedToken = jwtDecode(localStorage.getItem("token"));

  // if token has expired then remove token from localStorage
  // and user must log back in
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("token");
  } else {
    initialState.user = decodedToken;
  }
}

// initiate a context object and pass in a default value
// can access this object from components that subscribe to the provider of this context
const authContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
  setToken: null,
});

// this returns a new state
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

// this is being imported in ./App.js
function AuthProvider(props) {
  // dispatch calls authReducer function
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setToken = (token) => {
    localStorage.setItem("token", token);
  };

  const login = (userData) => {
    setToken(userData.token);

    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");

    dispatch({ type: "LOGOUT" });
  };

  return (
    <authContext.Provider
      value={{ user: state.user, login, logout, setToken }}
      {...props}
    />
  );
}

export { authContext, AuthProvider };
