// make API request..
// it allows us to make the api requests..
// npm i axios

import axios from "axios";
import jwt_decode from "jwt-decode";

// backend domain -
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/*
now, we want use helper functions in react components, for larger application we use redux okk!!!
npm i zustand
*/

// npm i jwt-decode
// for decoding the token..
// get username from toke after reloading the browser here ..
export async function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) {
    return Promise.reject("Can not find token");
  }
  let decode = jwt_decode(token);
  // console.log(decode);
  return decode;
}

// authenticate function..
export async function authenticate(username) {
  try {
    return await axios.post("/api/authenticate", { username });
  } catch (error) {
    return { error: "Username doesn't exist....!!" };
  }
}

// get User details..

export async function getUser({ username }) {
  try {
    const { data } = await axios.get(`/api/user/${username}`);
    return { data };
  } catch (error) {
    return { error: "Password doesn't match" };
  }
}

// register user function ..
export async function registerUser(credentials) {
  try {
    const {
      data: { message },
      status,
    } = await axios.post(`/api/register`, credentials);

    let { username, email } = credentials;
    // send email

    if (status === 201 || status === 200) {
      await axios.post(`/api/registerMail`, {
        username,
        userEmail: email,
        text: message,
      });
    }

    return Promise.resolve(message);
  } catch (error) {
    return Promise.reject({ error });
  }
}

// login funciton ..
export async function verifyPassword({ username, password }) {
  try {
    if (username) {
      const { data } = await axios.post(`/api/login`, { username, password });
      return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error: "Password doesn't match...!" });
  }
}

// update user function
export async function updateUser(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put(`/api/updateUser`, response, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update the Profile..!!" });
  }
}

export async function generateOTP(username) {
  try {
    const {
      data: { code },
      status,
    } = await axios.get(`/api/generateOTP`, { params: { username } });

    // send mail with the OTP..
    if (status === 201 || status === 200) {
      let {
        data: { email },
      } = await getUser({ username });
      let msg = `Your Passsword Recovery OTP is ${code}.Verify and recover your password.`;
      await axios.post(`/api/registerMail`, {
        username,
        userEmail: email,
        text: msg,
        subject: `Password Recovery!!`,
      });

      return Promise.resolve(code);
    }
  } catch (error) {
    return Promise.reject({ error });
  }
}

// verify OTP..
export async function verifyOTP({ username, code }) {
  try {
    const { data, status } = await axios.get(`/api/verifyOTP`, {
      params: { username, code },
    });
    return { data, status };
  } catch (error) {
    return Promise.reject({ error });
  }
}

// reset the password ..
export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put(`/api/resetPassword`, {
      username,
      password,
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}
