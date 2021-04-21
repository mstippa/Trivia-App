import { useContext, useState } from "react";
import { useMutation } from "react-query";
import { Container, Form, Button, Message } from "semantic-ui-react";
import { useHistory } from "react-router-dom";

import { registerUser } from "../util/api";
import { useForm } from "../util/hooks";

import { authContext } from "../context/auth";

function Register() {
  const history = useHistory();

  const context = useContext(authContext);

  const { onSubmit, onChange, formInputs, formErrors } = useForm(
    mutationCallback,
    { username: "", password: "", fname: "", lname: "" }, // initialState for formInputs
    {} // initialState for formErrors
  );

  const mutation = useMutation(() => registerUser(formInputs), {
    onSuccess: (data) => {
      if (!data.error) {
        context.login(data);
        history.push("/");
      }
    },
  });

  // TODO figure out why error is thrown if this is a fat arrow function
  // error: Cannot access 'mutationCallback' before initialization
  function mutationCallback() {
    // clearing the data of a previous mutation request
    if (!!mutation.data) mutation.reset();

    mutation.mutate();
  }

  return (
    <Container text>
      <Form
        onSubmit={onSubmit}
        error={!!mutation.data && !!mutation.data.error}
      >
        <Form.Input
          label="First Name"
          placeholder="First Name.."
          onChange={onChange}
          value={formInputs.fname}
          type="text"
          name="fname"
          error={formErrors.fname ? formErrors.fname : false}
        />
        <Form.Input
          label="Last Name"
          placeholder="Last Name.."
          onChange={onChange}
          value={formInputs.lname}
          type="text"
          name="lname"
          error={formErrors.lname ? formErrors.lname : false}
        />
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
          placeholder="Password.."
          onChange={onChange}
          value={formInputs.password}
          type="text"
          name="password"
          error={formErrors.password ? formErrors.password : false}
        />
        <Button type="submit" primary>
          Login
        </Button>
        <Message
          error
          content={
            !!mutation.data && !!mutation.data.error ? mutation.data.error : ""
          }
        />
      </Form>
    </Container>
  );
}

export default Register;
