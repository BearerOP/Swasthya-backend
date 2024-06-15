const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
  overall,
  relatives,
} = require("../controllers/leaderboard_controller.js");

router.get("/leaderboard/overall", user_auth, overall);

router.get("/leaderboard/relatives", user_auth, relatives);

module.exports = router;
