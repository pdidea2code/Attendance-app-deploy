const express = require("express");
const verifyAdminToken = require("../../helper/verifyAdminToken");
const permissionManage = require("../../helper/permissionManage");
const { addEvent, updateEvent, getAllEvents, deleteEvent, deleteMultiEvent } = require("../../controller/admin/event");
const router = express.Router();

router.post("/addEvent", verifyAdminToken, permissionManage("event.add"), addEvent);
router.post("/updateEvent", verifyAdminToken, permissionManage("event.edit"), updateEvent);
router.get("/getAllEvents", verifyAdminToken, permissionManage("event.view"), getAllEvents);
router.post("/deleteEvent/:id", verifyAdminToken, permissionManage("event.delete"), deleteEvent);
router.post("/deleteMultiEvent", verifyAdminToken, permissionManage("event.delete"), deleteMultiEvent);

module.exports = router;
