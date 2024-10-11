const express = require("express");
const authRouter = require("./authRouter");
const router = express.Router();
const attendanceRouter = require("./attendanceRouter");
const leaveRouter = require("./leaveRouter");
const homepageRouter = require("./homepageRouter");

router.use("/app", authRouter);
router.use("/app/attendance", attendanceRouter);
router.use("/app/leave", leaveRouter);
router.use("/app/homepage", homepageRouter);

module.exports = router;
