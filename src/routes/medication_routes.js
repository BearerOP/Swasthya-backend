const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
    create_medication,
    delete_medication,
    update_medication,
    view_medication,
    view_all_medication,
    
} = require("../controllers/medication_controller.js");

router.use(user_auth);

router.post("/", create_medication); // Create a new medication
router.delete("/", delete_medication); // Delete a medication
// router.put("/", update_medication); // Update a medication
router.get("/", view_medication);
router.get("/all", view_all_medication);

// reminder_router.post("/medication/update", user_auth, update_medication);


module.exports = router;