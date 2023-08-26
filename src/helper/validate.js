import toast from "react-hot-toast";
import { authenticate } from "./helper";

// validate login page username..
export async function usernameValidate(values) {
  const error = usernameVerify({}, values);

  if (values.username) {
    //check for the user existence ..
    const { status } = await authenticate(values.username);
    if (status !== 200) {
      error.exist = toast.error("User does not exist!");
    }
  }

  return error;
}

// password page ..
export async function passwordValidate(values) {
  return passwordVerify({}, values);
}

// validate username
// error with default object..
function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error("Username required ..!");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid Username! -> no spaces");
  }
  return error;
}

// validate password
function passwordVerify(error = {}, values) {
  const specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

  if (!values.password) {
    error.password = toast.error("Password required!!");
  } else if (values.password.includes(" ")) {
    error.password = toast.error("Invalid password !!");
  } else if (values.password.length < 4) {
    error.password = toast.error("at least 4 characters..");
  } else if (!specialChars.test(values.password))
    error.password = toast.error("must include special characters ..");
  return error;
}

// validate reset password here..
export async function resetPasswordValidate(values) {
  const error = passwordVerify({}, values);
  if (values.password !== values.confirm_password) {
    error.exist = toast.error("Password not matching .."); //adding a error not in function but in outer layer okk!!!
  }

  return error;
}

// validate register form ..
export async function registerFormValidate(values) {
  let error = usernameVerify({}, values);
  error = passwordVerify(error, values);
  error = emailVerify(error, values);

  return error;
}

// to validate the email id
function emailVerify(error = {}, values) {
  console.log("working register");
  const regExEmail =
    /^[a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!values.email) {
    error.email = toast.error("Email Required !!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Must be valid email ..");
  } else if (!regExEmail.test(values.email)) {
    error.email = toast.error("Invalid Email!!");
  }
  return error;
}

// validate profile page
export async function profileValidation(values) {
  let error = emailVerify({}, values);
  return error;
}
