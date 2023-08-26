const UserModel = require("../model/User.model");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const { username, password, profile, email } = req.body;

    // check the existing user
    const existingUsername = await UserModel.findOne({ username });
    if (existingUsername) {
      return res.status(400).send({ error: "Please use a unique username" });
    }

    // check for existing email
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).send({ error: "Please use a unique email" });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({
        username,
        password: hashedPassword,
        profile: profile || "",
        email,
      });
      try {
        const result = await user.save();
        res.status(201).send({ message : "User Registered Successfully" });
      } catch (error) {
        res.status(500).send({ error: "Failed to save user" });
      }
    }
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = register;