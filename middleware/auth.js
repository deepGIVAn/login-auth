const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// under the auth-> bearer
const auth = async (req, res, next) => {
  try {
    // access the authorized headers.. to get the token for validation ..
    const token = req.headers.authorization.split(" ")[1];

    // retrieve the user details..
    const decoded = await jwt.verify(token, JWT_SECRET);

    req.user = decoded; // userid,usename,iat,exp
    console.log(decoded);
    // res.status(201).json(decoded);   next and response can not be at a single time ..
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication Failed !!" });
  }
};

// it is the vaiable only createed when we call the generate otp.. for verifying the otp..
const localVariables = async (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
};

module.exports = { auth, localVariables };
