import { useState } from "react";

export const useForm = (
  callback,
  initialFormInputs = {},
  initialFormErrors = {}
) => {
  const [formInputs, setFormInputs] = useState(initialFormInputs);
  const [formErrors, setFormErrors] = useState(initialFormErrors);

  const onChange = (event) =>
    setFormInputs({ ...formInputs, [event.target.name]: event.target.value });

  const onSubmit = (event) => {
    event.preventDefault();

    const errorsExist = formValidation();

    if (errorsExist) return;

    callback();
  };

  const formValidation = () => {
    const errors = {};
    for (const input in formInputs) {
      if (formInputs[input].trim() === "") {
        errors[input] = "Field Must Not Be Empty";
      }
    }
    if (Object.entries(errors).length !== 0) {
      setFormErrors(errors);
      return true;
    }
  };

  return {
    onChange,
    onSubmit,
    formInputs,
    formErrors,
  };
};
