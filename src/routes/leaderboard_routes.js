const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
  overall,
  friendsAndFamily,
} = require("../controllers/leaderboard_controller.js");

router.get("/leaderboard/overall", user_auth, overall);

router.get("/leaderboard/friendsAndFamily", user_auth, friendsAndFamily);

module.exports = router;
