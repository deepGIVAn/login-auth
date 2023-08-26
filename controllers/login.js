const UserModel = require("../model/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");


const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send("Username not found!!");
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(400).send("Password don't match!!");
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.status(200).send({
      message: "Login Successful!!",
      username: user.username,
      token,
    });
  } catch (error) {
    return res.status(500).send(error.message || "Internal server error");
  }
};

module.exports = login;
