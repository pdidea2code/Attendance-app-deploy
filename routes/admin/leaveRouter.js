const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const permissionManage = require("../../helper/permissionManage");
const { getUserLeave, changeStatus, getallLeave } = require("../../controller/admin/leave");

const router = express.Router();

router.post("/getUserLeave", verifyAdminToken, permissionManage("leave.view"), getUserLeave);
router.post("/changeStatus", verifyAdminToken, permissionManage("leave.edit"), changeStatus);
router.post("/getallLeave", verifyAdminToken, permissionManage("leave.view"), getallLeave);

module.exports = router;
