const express = require("express");
const router = express.Router();

const {
    getWaterController,
    updateWaterController,
} = require('../controllers/water_controller.js')

const user_auth = require("../../middleware/user_auth.js");

router.get("/water",user_auth, getWaterController);
router.put("/water",user_auth, updateWaterController);

module.exports = router;