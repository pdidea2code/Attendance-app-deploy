const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const permissionManage = require("../../helper/permissionManage");
const { addMonth, getMonth, updateMonth, deleteMonth, deleteMultiMonth } = require("../../controller/admin/month");
const router = express.Router();

router.post("/addMonth", verifyAdminToken, permissionManage("month.add"), addMonth);
router.get("/getMonth", verifyAdminToken, permissionManage("month.view"), getMonth);
router.post("/updateMonth", verifyAdminToken, permissionManage("month.edit"), updateMonth);
router.post("/deleteMonth/:id", verifyAdminToken, permissionManage("month.delete"), deleteMonth);
router.post("/deleteMultiMonth", verifyAdminToken, permissionManage("month.delete"), deleteMultiMonth);

module.exports = router;
