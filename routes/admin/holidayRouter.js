const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const permissionManage = require("../../helper/permissionManage");
const {
  addHoliday,
  updateHoliday,
  getAllHolidays,
  deleteHoliday,
  deleteMultiHoliday,
} = require("../../controller/admin/holiday");
const router = express.Router();

router.post("/addHoliday", verifyAdminToken, permissionManage("holiday.add"), addHoliday);
router.post("/updateHoliday", verifyAdminToken, permissionManage("holiday.edit"), updateHoliday);
router.get("/getAllHolidays", verifyAdminToken, permissionManage("holiday.view"), getAllHolidays);
router.post("/deleteHoliday/:id", verifyAdminToken, permissionManage("holiday.delete"), deleteHoliday);
router.post("/deleteMultiHoliday", verifyAdminToken, permissionManage("holiday.delete"), deleteMultiHoliday);

module.exports = router;
