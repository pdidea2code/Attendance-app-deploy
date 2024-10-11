const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const permissionManage = require("../../helper/permissionManage");
const {
  getAllAttendance,
  getUseridAttendance,
  checkIn,
  checkOut,
  addAttendance,
  updateAttendance,
  getMonthAttendance,
} = require("../../controller/admin/attendance");
const router = express.Router();

router.post("/getAllAttendance", verifyAdminToken, permissionManage("attendance.view"), getAllAttendance);
router.post("/getUseridAttendance", verifyAdminToken, permissionManage("attendance.view"), getUseridAttendance);
router.post("/checkIn", verifyAdminToken, permissionManage("attendance.add"), checkIn);
router.post("/checkOut", verifyAdminToken, permissionManage("attendance.add"), checkOut);
router.post("/addAttendance", verifyAdminToken, permissionManage("attendance.add"), addAttendance);
router.post("/updateAttendance", verifyAdminToken, permissionManage("attendance.edit"), updateAttendance);
router.post("/getMonthAttendance", verifyAdminToken, permissionManage("attendance.view"), getMonthAttendance);

module.exports = router;
