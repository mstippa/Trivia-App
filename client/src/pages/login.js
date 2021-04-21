import React, { useState, useContext } from "react";
import { useMutation } from "react-query";
import { Button, Form, Container, Message } from "semantic-ui-react";
import { useHistory } from "react-router-dom";

import { login } from "../util/api";
import { useForm } from "../util/hooks";

import { authContext } from "../context/auth";

const errorMessage = "Incorrect Credentials";

function Login() {
  const history = useHistory();

  const context = useContext(authContext);

  const mutationCallback = () => {
    // clearing the data of a previous mutation request
    if (!!mutation.data) mutation.reset();

    mutation.mutate();
  };

  const { onSubmit, onChange, formInputs, formErrors } = useForm(
    mutationCallback,
    { username: "", password: "" }, // initialState for formInputs
    {} // initialState for formErrors
  );

  const mutation = useMutation(() => login(formInputs), {
    onSuccess: (data) => {
      if (!data.error) {
        context.login(data);
        history.push("/");
      }
    },
  });

  return (
    <Container className="form__container" text>
      <Form
        onSubmit={onSubmit}
        error={!!mutation.data && !!mutation.data.error}
      >
        <Form.Input
          label="Username"
          placeholder="Username.."
          onChange={onChange}
          value={formInputs.username}
          type="text"
          name="username"
          error={formErrors.username ? formErrors.username : false}
        />
        <Form.Input
          label="Password"
          placeholder="Password"
          onChange={onChange}
          type="text"
          name="password"
          value={formInputs.password}
          error={formErrors.password ? formErrors.password : false}
        />
        <Button type="submit" primary>
          Login
        </Button>
        <Message error content={errorMessage} />
      </Form>
    </Container>
  );
}

export default Login;
