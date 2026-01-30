export const regErrors = {
  errors: [
    {
      message: "email: Email is Required!",
      appCode: "required_field",
      meta: {
        name: "email",
      },
    },
    {
      message: "password: Password is Required!",
      appCode: "required_field",
      meta: {
        name: "password",
      },
    },
    {
      message: "confirmPassword: ConfirmPassword is Required!",
      appCode: "required_field",
      meta: {
        name: "confirmPassword",
      },
    },
    {
      message: "email: Please provide a valid email",
      appCode: "invalid_email",
      meta: null,
    },
    {
      message:
        "password: Password should contains Capital letters, digits and has length greater than 8",
      appCode: "invalid_password_length",
      meta: { min: "8" },
    },
    {
      message: "confirmPassword: ConfirmPassword mismatch Password",
      // it will become like this in the response
      appCode: "invalid_password_mismatch",
      meta: null,
    },
    {
      message: "invalid email alread exists",
      appCode: "invalid_email_exist",
      meta: null,
    },
  ],
};
