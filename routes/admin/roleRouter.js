const express = require("express");
const {
  addRole,
  changePermission,
  getAllRole,
  getRolle,
  deleteRole,
  updateRole,
} = require("../../controller/admin/role");
const roleManager = require("../../helper/roleManage");
const permissionManage = require("../../helper/permissionManage");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const router = express.Router();

router.post("/addRole", verifyAdminToken, permissionManage("role.add"), addRole);
router.post("/changePermission", verifyAdminToken, permissionManage("role.edit"), changePermission);
router.get("/getAllRole", verifyAdminToken, permissionManage("role.view"), getAllRole);
router.post("/deleteRole", verifyAdminToken, permissionManage("role.delete"), deleteRole);
router.post("/updateRole", verifyAdminToken, permissionManage("role.edit"), updateRole);
router.get("/getRolle", verifyAdminToken, getRolle);

module.exports = router;
