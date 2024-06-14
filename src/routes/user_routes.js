const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
  user_register,
  user_login,
  user_logout,
  user_profile,
  sendOtp
} = require("../controllers/user_controller.js");

router.post("/login", user_login);

router.post("/register", user_register);

router.post("/logout",user_auth,user_logout)

router.post("/sendOtp",sendOtp);

router.get("/profile",user_auth,user_profile);

module.exports = router;
