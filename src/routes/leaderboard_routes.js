const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
  overall,
  relatives,
  overall_ranking
} = require("../controllers/leaderboard_controller.js");

router.post("/leaderboard/overall", user_auth, overall);

router.post("/leaderboard/relatives", user_auth, relatives);

router.get('/leaderboard/overall/ranking',user_auth,overall_ranking)

module.exports = router;
