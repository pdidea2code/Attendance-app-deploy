const express = require("express");
const router = express.Router();
const verifyAdminToken = require("../../helper/verifyAdminToken");
const permissionManage = require("../../helper/permissionManage");
const {
  addGeneralsetting,
  getGeneralsetting,
  updateGeneralsetting,
  getMapApikey,
} = require("../../controller/admin/generalsetting");

router.post("/addGeneralsetting", verifyAdminToken, permissionManage("generalsetting.edit"), addGeneralsetting);
router.get("/getGeneralsetting", verifyAdminToken, permissionManage("generalsetting.view"), getGeneralsetting);
router.post("/updateGeneralsetting", verifyAdminToken, permissionManage("generalsetting.edit"), updateGeneralsetting);
router.get("/getMapApikey", verifyAdminToken, getMapApikey);

module.exports = router;
