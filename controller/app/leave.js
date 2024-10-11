const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Leave = require("../../model/Leave");
const moment = require("moment");

const addLeave = async (req, res, next) => {
  try {
    const { date, levaetype, reson, todate, hour } = req.body;

    function isValidDateFormat(dateStr) {
      const regex = /^\d{2}\/\d{2}\/\d{4}$/;
      return regex.test(dateStr);
    }

    function convertDate(dateStr) {
      const [day, month, year] = dateStr.split("/").map(Number);
      return new Date(year, month - 1, day);
    }

    if (!isValidDateFormat(date)) {
      return queryErrorRelatedResponse(res, 400, "Invalid date format. Please use DD/MM/YYYY.");
    }
    if (todate && !isValidDateFormat(todate)) {
      return queryErrorRelatedResponse(res, 400, "Invalid date format. Please use DD/MM/YYYY.");
    }

    const leave = await Leave.create({
      date: convertDate(date),
      levaetype: levaetype,
      reson: reson,
      user_id: req.user._id,
    });

    if (todate) {
      leave.todate = convertDate(todate);
      const startDate = convertDate(date);
      const endDate = convertDate(todate);
      leave.day = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
      leave.type = "Multiple Days";
    } else if (hour) {
      leave.hour = hour;
      leave.type = "Hour";
      leave.day = 0;
    } else {
      leave.type = "Single Day";
      leave.day = 1;
    }

    await leave.save();
    successResponse(res, "Leave added successfully");
  } catch (error) {
    next(error);
  }
};

const getLeave = async (req, res, next) => {
  try {
    const leave = await Leave.find({ user_id: req.user._id });

    successResponse(res, leave);
  } catch (error) {
    next(error);
  }
};

const leaveCount = async (req, res, next) => {
  try {
    const startDate = new Date(req.user.createdAt);
    const currentDate = new Date();

    let totalMonths = (currentDate.getFullYear() - startDate.getFullYear()) * 12;
    totalMonths += currentDate.getMonth() - startDate.getMonth();

    if (currentDate.getDate() < startDate.getDate()) {
      totalMonths--;
    }

    const Pending = await Leave.find({
      user_id: req.user._id,
      status: "Pending",
    });
    const Rejected = await Leave.find({
      user_id: req.user._id,
      status: "Rejected",
    });
    const Approved = await Leave.find({
      user_id: req.user._id,
      status: "Approved",
    });

    let availableLeave = totalMonths;

    const currentMonthApprovedLeaves = Approved.filter((leave) => {
      const leaveDate = new Date(leave.date);
      return (
        leaveDate.getFullYear() > startDate.getFullYear() ||
        (leaveDate.getFullYear() === startDate.getFullYear() && leaveDate.getMonth() + 1 > startDate.getMonth() + 1)
      );
    }).length;

    const currentMonthPendingLeaves = Pending.filter((leave) => {
      const leaveDate = new Date(leave.date);
      return (
        leaveDate.getFullYear() > startDate.getFullYear() ||
        (leaveDate.getFullYear() === startDate.getFullYear() && leaveDate.getMonth() + 1 > startDate.getMonth() + 1)
      );
    }).length;

    const totalleve = currentMonthApprovedLeaves + currentMonthPendingLeaves;
    if (currentMonthApprovedLeaves > 0 || currentMonthPendingLeaves > 0) {
      availableLeave -= totalleve;
    }
    if (availableLeave < 0) {
      availableLeave = 0;
    }

    // if (currentMonthApprovedLeaves > 0) {
    //   availableLeave -= currentMonthApprovedLeaves;
    // }
    // if (currentMonthPendingLeaves > 0) {
    //   availableLeave -= currentMonthPendingLeaves;
    // }

    const data = {
      Pending: Pending.length,
      Rejected: Rejected.length,
      Approved: Approved.length,
      availableLeave,
    };

    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const leaveCountCorrentYear = async (req, res, next) => {
  try {
    const currentDates = new Date();
    const startDateYear = new Date(currentDates.getFullYear(), 0, 1);
    const startDateJoin = new Date(req.user.createdAt);
    const startDate = startDateYear > startDateJoin ? startDateYear : startDateJoin;
    const currentDate = new Date(startDate);
    let totalMonths = currentDates.getMonth() + 1;

    if (startDateJoin === startDate) {
      totalMonths = currentDate.getMonth() + 1;
    }
    if (startDate === startDateJoin) {
      const start = currentDate.getMonth() + 1;
      const end = currentDates.getMonth() + 1;
      totalMonths = end - start;
    }

    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);

    const Pending = await Leave.find({
      user_id: req.user._id,
      status: "Pending",
      date: { $gte: startOfYear, $lt: endOfYear },
    });
    const Rejected = await Leave.find({
      user_id: req.user._id,
      status: "Rejected",
      date: { $gte: startOfYear, $lt: endOfYear },
    });
    const Approved = await Leave.find({
      user_id: req.user._id,
      status: "Approved",
      date: { $gte: startOfYear, $lt: endOfYear },
    });

    let availableLeave = totalMonths;

    const currentMonthApprovedLeaves = Approved.filter((leave) => {
      const leaveDate = new Date(leave.date);
      return leaveDate.getFullYear() === currentDate.getFullYear();
    }).length;

    const currentMonthPendingLeaves = Pending.filter((leave) => {
      const leaveDate = new Date(leave.date);
      return leaveDate.getFullYear() === currentDate.getFullYear();
    }).length;

    const totalleve = currentMonthApprovedLeaves + currentMonthPendingLeaves;
    if (currentMonthApprovedLeaves > 0 || currentMonthPendingLeaves > 0) {
      availableLeave -= totalleve;
    }

    if (availableLeave < 0) {
      availableLeave = 0;
    }

    const data = {
      Pending: Pending.length,
      Rejected: Rejected.length,
      Approved: Approved.length,
      availableLeave,
    };

    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

module.exports = { addLeave, getLeave, leaveCount, leaveCountCorrentYear };
