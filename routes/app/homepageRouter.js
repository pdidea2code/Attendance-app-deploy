const express = require("express");
const verifyAppToken = require("../../helper/verifyAppToken");
const { homepage, holidayList, generalSetting, getNotification } = require("../../controller/app/home page");
const router = express.Router();

router.get("/homepage", verifyAppToken, homepage);
router.get("/holidayList", verifyAppToken, holidayList);
router.get("/generalSetting", verifyAppToken, generalSetting);
router.get("/getNotification", verifyAppToken, getNotification);

module.exports = router;
