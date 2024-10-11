const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const permissionManage = require("../../helper/permissionManage");
const { addSetting, getSetting, updateSetting } = require("../../controller/admin/setting");
const router = express.Router();

router.post("/addSetting", verifyAdminToken, permissionManage("setting.add"), addSetting);
router.get("/getSetting", verifyAdminToken, permissionManage("setting.view"), getSetting);
router.post("/updateSetting", verifyAdminToken, permissionManage("setting.edit"), updateSetting);

module.exports = router;
