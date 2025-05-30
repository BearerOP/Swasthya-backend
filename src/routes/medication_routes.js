const express = require("express");
const reminder_router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
    create_medication,
    delete_medication,
    update_medication,
    view_medication,
    view_all_medication,
    
} = require("../controllers/medication_controller.js");

reminder_router.use(user_auth);

reminder_router.post("/", create_medication);
reminder_router.delete("/", delete_medication);
reminder_router.get("/view", view_medication);
reminder_router.get("/all", view_all_medication);

// reminder_router.post("/medication/update", user_auth, update_medication);


module.exports = reminder_router;