const express = require("express");
const verifyAppToken = require("../../helper/verifyAppToken");
const {
  addLeave,
  getLeave,
  leaveCount,
  leaveCountCorrentYear,
  upcomingLeave,
  pastLeave,
} = require("../../controller/app/leave");

const router = express.Router();

router.post("/addLeave", verifyAppToken, addLeave);
router.get("/getLeave", verifyAppToken, getLeave);
router.get("/leaveCount", verifyAppToken, leaveCount);
router.get("/leaveCountCorrentYear", verifyAppToken, leaveCountCorrentYear);
router.get("/upcomingLeave", verifyAppToken, upcomingLeave);
router.get("/pastLeave", verifyAppToken, pastLeave);

module.exports = router;
