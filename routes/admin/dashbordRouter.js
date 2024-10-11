const express = require("express");
const router = express.Router();
const verifyAdminToken = require("../../helper/verifyAdminToken");
const permissionManage = require("../../helper/permissionManage");
const { getAttendanceCount, leaveRequest } = require("../../controller/admin/dashboard");

router.get("/getAttendanceCount", verifyAdminToken, permissionManage("dashboard.view"), getAttendanceCount);
router.get("/leaveRequest", verifyAdminToken, permissionManage("dashboard.view"), leaveRequest);

module.exports = router;
