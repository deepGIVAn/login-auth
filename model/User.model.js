const mongoose = require("mongoose");

// const { Schema,model } = mongoose;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    // error msg when there is not a username
    required: [true, "Please provide unique Username"],
    unique: [true, "Username Exist"], // also with error msg here ..
  },
  password: {
    type: String,
    required: [true, "Please provide a passowr"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Please provide a unique Email"],
    unique: [true, "Email Exists!!"],
  },
  firstname: {
    type: String,
    // required: true,
  },
  lastname: {
    type: String,
    // required: true,
  },
  mobile: {
    type: Number,
  },
  address: {
    type: String,
  },
  profile: {
    type: String,
  },
});

module.exports = mongoose.model.Users || mongoose.model("User", UserSchema);
