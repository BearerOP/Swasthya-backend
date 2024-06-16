const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth");

const {
  getAllRelatives,
  getRelativeMedication,
} = require("../controllers/relatives_controller.js");

router.get("/relatives/all", user_auth, getAllRelatives);

router.get("/relatives/medication", user_auth, getRelativeMedication);

module.exports = router;
