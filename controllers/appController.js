const register = require("./register");
const login = require("./login");
const UserModel = require("../model/User.model");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");

// using the mongod sever everytime the server starts so data got wiped out point to be noted !!

// middleware for verfying the user before getting to loging
const verifyUser = async (req, res, next) => {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send("Username not found!!!!!!!");
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
};

// http://localhost:8080/api/user/deepak   -- using params
const getUser = async (req, res) => {
  const { username } = req.params;

  try {
    if (!username) {
      return res.status(400).send({ error: "Invalid Username provided." });
    }
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "Could not find the User." });
    }
    // convert it into json so that we don't get unnecessary data from the mongoose here ...
    const { password, ...rest } = Object.assign({}, user.toJSON()); // converting the object into json here ...

    return res.status(200).send( rest );
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};

// middleware for updating the user ..

// http://localhost:8080/api/updateUser?id=64e0804a0c764ae30054a202
// under the query okkk!! when we don't use query so just leave the id ..

const updateUser = async (req, res) => {
  // const {id} = req.params; this time we are getting the id from query okk!!
  try {
    // const { id } = req.query;
    const { userId } = req.user;
    if (!userId) {
      return res.status(400).send({ error: "User ID not provided." });
    }

    const body = req.body;

    UserModel.updateOne({ _id: userId }, body)
      .then((data) => {
        if (data.nModified === 0) {
          return res.status(404).send({ error: "User not found." });
        }
        return res.status(200).send({ message: "Record Updated Successfully!" });
      })
      .catch((error) => {
        return res.status(500).send({ error: "Failed to update user." });
      });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};

// when user try to reset their password..
// http://localhost:8080/api/generateOTP?username=deepak
// by using req.query
const generateOTP = async (req, res) => {
  // npm i otp-generator
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  res.status(201).send({ code: req.app.locals.OTP });
};

// http://localhost:8080/api/verifyOTP?code=372819
// by using req.query
const verifyOTP = async (req, res) => {
  const { code } = req.query;
  if (parseInt(code) === parseInt(req.app.locals.OTP)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true; // start the session for reset the password ..
    return res.status(201).send({ message: "Verify Successfully!!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
};

// successfully redirect the user when OTP is valid ..
const createResetSession = (req, res) => {
  if (req.app.locals.resetSession) {
    // req.app.locals.resetSession = false; for protecting the route..
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session Expired !!" });
};

const resetPassword = async (req, res) => {
  try {
    if (!req.app.locals.resetSession)
      return res.status(400).send({ error: "Session Expired !!" });

    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .send({ error: "Username and password are required." });
    }

    try {
      const user = await UserModel.findOne({ username });
      if (!user) {
        return res.status(404).send({ error: "Username not found!" });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      UserModel.updateOne(
        { username: user.username },
        { password: hashPassword }
      )
        .then((data) => {
          if (data.nModified === 0) {
            return res.status(200).send({ message: "No changes made." });
          }
          req.app.locals.resetSession = false;
          return res
            .status(200)
            .send({ message: "Password Updated Successfully!" });
        })
        .catch((error) => {
          return res.status(500).send({ error: "Failed to update password." });
        });
    } catch (error) {
      return res.status(500).send({ error: "Internal server error" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
};

module.exports = {
  register,
  login,
  getUser,
  resetPassword,
  createResetSession,
  verifyOTP,
  generateOTP,
  updateUser,
  verifyUser,
};
