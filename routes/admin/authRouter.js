const express = require("express");
const {
  Signup,
  Login,
  RefreshToken,
  checkEmailId,
  verifyLink,
  changePassword,
  resetPassword,
  changeProfile,
} = require("../../controller/admin/auth");
const { singleFileUpload } = require("../../helper/fiileUpload");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const router = express.Router();

router.post(
  "/signup",
  singleFileUpload("public/profileimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  Signup
);
router.post("/login", Login);
router.post("/refreshToken", RefreshToken);
router.post("/checkEmailId", checkEmailId);
router.post("/verifyLink", verifyLink);
router.post("/resetPassword", resetPassword);
router.post("/changePassword", verifyAdminToken, changePassword);
router.post(
  "/changeProfile",
  verifyAdminToken,
  singleFileUpload("public/profileimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  changeProfile
);

module.exports = router;
