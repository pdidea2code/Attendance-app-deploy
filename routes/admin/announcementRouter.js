const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const permissionManage = require("../../helper/permissionManage");
const {
  addAnnouncement,
  getAllAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  deleteManyAnnouncement,
} = require("../../controller/admin/announcement");
const { singleFileUpload } = require("../../helper/fiileUpload");
const router = express.Router();

router.post(
  "/addAnnouncement",
  verifyAdminToken,
  permissionManage("announcement.add"),
  singleFileUpload("public/announcementimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  addAnnouncement
);
router.get("/getAllAnnouncement", verifyAdminToken, permissionManage("announcement.view"), getAllAnnouncement);
router.post(
  "/updateAnnouncement",
  verifyAdminToken,
  permissionManage("announcement.edit"),
  singleFileUpload("public/announcementimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  updateAnnouncement
);
router.get("/deleteAnnouncement/:id", verifyAdminToken, permissionManage("announcement.delete"), deleteAnnouncement);
router.post(
  "/deleteManyAnnouncement",
  verifyAdminToken,
  permissionManage("announcement.delete"),
  deleteManyAnnouncement
);

module.exports = router;
