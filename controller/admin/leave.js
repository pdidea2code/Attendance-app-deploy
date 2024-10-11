const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Leave = require("../../model/Leave");
const Notification = require("../../model/Notification");

const getUserLeave = async (req, res, next) => {
  try {
    const leave = await Leave.find({ user_id: req.body.id });

    successResponse(res, leave);
  } catch (error) {
    next(error);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.body.id);
    if (!leave) return queryErrorRelatedResponse(res, 404, "Date Not Found");

    leave.status = req.body.status;
    if (req.body.status === "Approved") {
      leave.approveby = req.admin._id;
      leave.approvebyname = req.admin.name;
      const notification = await Notification.create({
        title: "Leave Update",
        description: "Your leave has been approved.",
        user_id: leave.user_id,
      });
    }
    if (req.body.status === "Rejected") {
      leave.approveby = req.admin._id;
      leave.approvebyname = req.admin.name;
      const notification = await Notification.create({
        title: "Leave Update",
        description: "Your leave has been rejected.",
        user_id: leave.user_id,
      });
    }
    await leave.save();
    successResponse(res, "Status Update Successfully");
  } catch (error) {
    next(error);
  }
};

const getallLeave = async (req, res, next) => {
  try {
    const leave = await Leave.find().populate("user_id");

    successResponse(res, leave);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserLeave, changeStatus, getallLeave };
