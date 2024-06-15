const {send_request,alluser, allRequest,acceptRequest} = require("../controllers/request_controller.js")
const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");



router.post("/send_request",user_auth,  send_request);
router.get("/alluser",user_auth,  alluser);
router.get("/allRequest",user_auth,  allRequest);
router.post('/acceptRequest',user_auth,acceptRequest)

module.exports = router;