const { Router } = require("express");
const router = Router();
const {
  register,
  login,
  getUser,
  resetPassword,
  createResetSession,
  verifyOTP,
  generateOTP,
  updateUser,
  verifyUser,
} = require("../controllers/appController");
const { auth, localVariables } = require("../middleware/auth");
const registerMail = require("../controllers/mailer");

// import * as controller from "../controllers/appController"

router.route("/register").post(register);
router.route("/registerMail").post(registerMail);
router.route("/authenticate").post(verifyUser, (req, res) => res.status(200).end());
router.route("/login").post(verifyUser, login);

router.route("/user/:username").get(getUser);
router.route("/generateOTP").get(verifyUser, localVariables, generateOTP);
router.route("/verifyOTP").get(verifyUser,verifyOTP);
router.route("/createResetSession").get(createResetSession);

router.route("/updateUser").put(auth, updateUser);
router.route("/resetPassword").put(verifyUser, resetPassword);

module.exports = router;
// when we are using import statements so `export default router;'
