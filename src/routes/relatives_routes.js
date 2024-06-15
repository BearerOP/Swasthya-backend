const express = require("express");
const router = express.Router();
const user_auth = require("../../middleware/user_auth.js");

const {
  add_relative,
  get_relatives,
  permission_control
} = require("../controllers/relative_controller.js");

router.get("/relatives/get", user_auth, get_relatives);
router.post("/relatives/add", user_auth, add_relative);

module.exports = router;