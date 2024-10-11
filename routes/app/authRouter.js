const express = require("express");
const {
  Register,
  Login,
  RefreshToken,
  checkEmailId,
  verifyOtp,
  resetPassword,
  changePassword,
  adduserProfile,
} = require("../../controller/app/auth");
const verifyAppToken = require("../../helper/verifyAppToken");
const { singleFileUpload } = require("../../helper/fiileUpload");
const router = express.Router();

router.post("/Register", Register);
router.post("/Login", Login);
router.post("/RefreshToken", RefreshToken);
router.post("/checkEmailId", checkEmailId);
router.post("/verifyOtp", verifyOtp);
router.post("/resetPassword", resetPassword);
router.post("/changePassword", verifyAppToken, changePassword);
router.post(
  "/adduserProfile",
  singleFileUpload("public/profileimg", ["image/png", "image/jpeg", "image/jpg"], 1024 * 5024, "image"),
  adduserProfile
);

module.exports = router;
