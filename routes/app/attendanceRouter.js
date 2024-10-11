const express = require("express");
const verifyAppToken = require("../../helper/verifyAppToken");
const { checkIn, getAttendance, checkOut } = require("../../controller/app/attendance");
const router = express.Router();

router.post("/checkIn", verifyAppToken, checkIn);
router.post("/getAttendance", verifyAppToken, getAttendance);
router.post("/checkOut", verifyAppToken, checkOut);

module.exports = router;
