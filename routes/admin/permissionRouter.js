const express = require("express");
const { addPermission, getPermissions, deletePermission } = require("../../controller/admin/permission");
const verifyAppToken = require("../../helper/verifyAppToken");
const permissionManage = require("../../helper/permissionManage");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const router = express.Router();

// Add Permission
router.post("/addPermission", verifyAdminToken, permissionManage("permission.add"), addPermission);

// Get All Permissions
router.get("/permissions", verifyAdminToken, permissionManage("permission.view"), getPermissions);

// Delete Permission
router.delete("/deletePermission/:id", verifyAdminToken, permissionManage("permission.delete"), deletePermission);

module.exports = router;
