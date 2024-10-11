const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const { getAllUsers, addUser, updateUser } = require("../../controller/admin/user");
const permissionManage = require("../../helper/permissionManage");
const { singleFileUpload } = require("../../helper/fiileUpload");
const router = express.Router();

router.get("/getAllUser", verifyAdminToken, permissionManage("employee.view"), getAllUsers);
router.post(
  "/addUser",
  verifyAdminToken,
  permissionManage("employee.add"),
  singleFileUpload("public/profileimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  addUser
);
router.post(
  "/updateUser/:id",
  verifyAdminToken,
  permissionManage("employee.add"),
  singleFileUpload("public/profileimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  updateUser
);

module.exports = router;
