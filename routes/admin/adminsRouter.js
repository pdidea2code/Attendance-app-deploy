const express = require("express");
const { getAllAdmin, addAdmin, updateAdmin, deleteAdmin, deleteManyAdmin } = require("../../controller/admin/admins");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const permissionManage = require("../../helper/permissionManage");
const { singleFileUpload } = require("../../helper/fiileUpload");
const router = express.Router();

router.get("/getAllAdmin", verifyAdminToken, permissionManage("admin.view"), getAllAdmin);
router.post(
  "/addAdmin",
  verifyAdminToken,
  permissionManage("admin.add"),
  singleFileUpload("public/profileimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  addAdmin
);
router.post(
  "/updateAdmin/:id",
  verifyAdminToken,
  permissionManage("admin.edit"),
  singleFileUpload("public/profileimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  updateAdmin
);

router.get("/deleteAdmin/:id", verifyAdminToken, permissionManage("admin.delete"), deleteAdmin);
router.post("/deleteManyAdmin", verifyAdminToken, permissionManage("admin.delete"), deleteManyAdmin);

module.exports = router;
