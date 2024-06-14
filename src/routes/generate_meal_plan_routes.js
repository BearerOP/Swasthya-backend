const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
    generateMealPlan,
    view_MealPlan
} = require("../controllers/generate_meal_plan_controllers.js");

router.get("/generateMealPlan",user_auth,  generateMealPlan);
router.get("/view_MealPlan",user_auth,  view_MealPlan);

module.exports = router;