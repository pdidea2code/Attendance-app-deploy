const { queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");
const Attendance = require("../../model/Attendance");
const axios = require("axios");
const Setting = require("../../model/Setting");
const { calculateDistance } = require("../../helper/calculateDistance");
const Month = require("../../model/Month");
const moment = require("moment");

const getAllAttendance = async (req, res, next) => {
  try {
    const { year, month, date } = req.body;

    function getMonthTimestampRange(year, month, date) {
      const paddedMonth = String(month).padStart(2, "0");
      const paddedDate = String(date).padStart(2, "0");
      const startDate = moment(`${year}-${paddedMonth}-${paddedDate}`, "YYYY-MM-DD");
      const endDate = moment(startDate).endOf("day");

      const startTimestamp = startDate.valueOf();
      const endTimestamp = endDate.valueOf();

      return {
        startTimestamp,
        endTimestamp,
      };
    }

    let attendance;

    if (!year || !month || !date) {
      attendance = await Attendance.find().populate({ path: "user_id", select: "name _id" });
      if (!attendance) return queryErrorRelatedResponse(res, 404, "Not Found");
    } else {
      const range = getMonthTimestampRange(year, month, date);
      attendance = await Attendance.find({
        day: { $gte: range.startTimestamp, $lt: range.endTimestamp },
      }).populate({
        path: "user_id",
        select: "name _id",
      });

      if (!attendance.length)
        return queryErrorRelatedResponse(res, 404, "No attendance records found for the specified date.");
    }

    successResponse(res, attendance);
  } catch (error) {
    next(error);
  }
};

const getUseridAttendance = async (req, res, next) => {
  try {
    function getMonthTimestampRange(year, month) {
      const paddedMonth = String(month).padStart(2, "0");
      const startDate = moment(`${year}-${paddedMonth}-01`, "YYYY-MM-DD");
      const endDate = moment(startDate).endOf("month");

      const startTimestamp = startDate.valueOf();
      const endTimestamp = endDate.valueOf();
      const daysInMonth = startDate.daysInMonth();

      return {
        startTimestamp,
        endTimestamp,
        daysInMonth,
      };
    }

    const { id, year, month } = req.body;
    if (!id) {
      return queryErrorRelatedResponse(res, 400, "User ID is required.");
    }

    let attendance;

    if (!year || !month) {
      attendance = await Attendance.find({ user_id: id }).populate({
        path: "user_id",
        select: "name _id",
      });
    } else {
      const range = getMonthTimestampRange(year, month);
      attendance = await Attendance.find({
        user_id: id,
        day: { $gte: range.startTimestamp, $lt: range.endTimestamp },
      }).populate({
        path: "user_id",
        select: "name _id",
      });
    }

    if (!attendance) {
      return queryErrorRelatedResponse(res, 404, "No attendance records found.");
    }

    successResponse(res, attendance);
  } catch (error) {
    next(error);
  }
};

const getMonthAttendance = async (req, res, next) => {
  try {
    function getMonthTimestampRange(year, month) {
      const paddedMonth = String(month).padStart(2, "0");
      const startDate = moment(`${year}-${paddedMonth}-01`, "YYYY-MM-DD");
      const endDate = moment(startDate).endOf("month");

      const startTimestamp = startDate.valueOf();
      const endTimestamp = endDate.valueOf();
      const daysInMonth = startDate.daysInMonth();

      return {
        startTimestamp,
        endTimestamp,
        daysInMonth,
      };
    }

    if (!req.body.year || !req.body.month) {
      req.body.month = moment().month() + 1;
      req.body.year = moment().year();
    }
    const range = getMonthTimestampRange(req.body.year, req.body.month);
    const attendance = await Attendance.find({
      user_id: req.body.id,
      day: { $gte: range.startTimestamp, $lt: range.endTimestamp },
    });
    if (!attendance) return queryErrorRelatedResponse(res, 404, "Not Found");

    let totalhour = 0;
    let totalworkingtime = 0;
    let totoalovertime = 0;
    let totoalattengance = 0;
    let workingdays = 0;

    const workingdayss = await Month.findOne({ month: req.body.month, year: req.body.year });
    if (workingdayss && workingdayss.day) {
      workingdays = workingdayss.day;
    }

    attendance.forEach((data) => {
      totalhour += Number(data.totalhour) || 0;
      totalworkingtime += Number(data.workingtime) || 0;
      totoalovertime += Number(data.overtime) || 0;
      totoalattengance = totoalattengance + (data.checkout ? 1 : 0);
    });

    // const selectedMonth = moment(`${req.body.year}-${req.body.month}`).daysInMonth();

    const total = {
      totalhour,
      totalworkingtime,
      totoalovertime,
      totoalattengance,
      workingdays: workingdays,
      daysInMonth: range.daysInMonth,
    };

    successResponse(res, total);
  } catch (error) {
    next(error);
  }
};

const checkIn = async (req, res, next) => {
  try {
    const lastAttendance = await Attendance.findOne({ user_id: req.body.id }).sort({ createdAt: -1 });
    if (lastAttendance && !lastAttendance.checkout) {
      return queryErrorRelatedResponse(res, 400, "You must check out first before checking in.");
    }

    const currentTime = new Date();
    // const currentTime = 1727440266216;
    const { checkinLatitude, checkinLongitude } = req.body;
    let location = req.body.location;

    try {
      const respo = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${checkinLatitude}&lon=${checkinLongitude}&format=json`
      );

      if (respo.data && respo.data.display_name) {
        location = respo.data.display_name;
      }
    } catch (axiosError) {
      console.error("Failed to get location from OpenStreetMap API", axiosError);
    }

    const attendance = await Attendance.create({
      user_id: req.body.id,
      checkin: currentTime,
      day: currentTime,
      checkinLatitude: checkinLatitude,
      checkinLongitude: checkinLongitude,
      location: location || "Unknown location",
    });

    return successResponse(res, "Check-in successful");
  } catch (error) {
    next(error);
  }
};

const checkOut = async (req, res, next) => {
  try {
    const currentTime = new Date();
    // const currentTime = 1727493365064;
    const { checkoutLatitude, checkoutLongitude } = req.body;

    if (!checkoutLatitude || !checkoutLongitude) {
      return queryErrorRelatedResponse(res, 400, "Location details are required.");
    }

    const lastAttendance = await Attendance.findOne({ user_id: req.body.id }).sort({ createdAt: -1 });

    if (!lastAttendance || !lastAttendance.checkin) {
      return queryErrorRelatedResponse(res, 400, "You must check in before checking out.");
    }

    if (lastAttendance.checkout) {
      return queryErrorRelatedResponse(res, 400, "You have already checked out.");
    }

    const setting = await Setting.findOne();
    if (!setting) {
      return queryErrorRelatedResponse(res, 500, "Server error: settings not found.");
    }

    const radius = calculateDistance(
      lastAttendance.checkinLatitude,
      lastAttendance.checkinLongitude,
      checkoutLatitude,
      checkoutLongitude
    );

    if (radius > setting.rediusmiter) {
      return queryErrorRelatedResponse(res, 400, "You are out of the coverage area.");
    }

    const workMillis = currentTime - lastAttendance.checkin;
    const workingTime = Math.floor(workMillis / 60000);

    lastAttendance.overtime = workingTime > setting.workingtime ? workingTime - setting.workingtime : 0;
    lastAttendance.totalhour = workingTime;
    lastAttendance.workingtime = setting.workingtime;
    lastAttendance.checkout = currentTime;
    lastAttendance.checkoutLatitude = checkoutLatitude;
    lastAttendance.checkoutLongitude = checkoutLongitude;
    lastAttendance.radius = radius;

    await lastAttendance.save();

    successResponse(res, "Check-Out successful");
  } catch (error) {
    next(error);
  }
};

const addAttendance = async (req, res, next) => {
  try {
    const { id, day, checkin, checkinLatitude, checkinLongitude, checkout, checkoutLatitude, checkoutLongitude } =
      req.body;
    let location = req.body.location;

    try {
      const respo = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${checkinLatitude}&lon=${checkinLongitude}&format=json`
      );

      if (respo.data && respo.data.display_name) {
        location = respo.data.display_name;
      }

      const radius = calculateDistance(checkinLatitude, checkinLongitude, checkoutLatitude, checkoutLongitude);
      const setting = await Setting.findOne();
      if (!setting) {
        return queryErrorRelatedResponse(res, 500, "Server error: settings not found.");
      }
      if (radius > setting.rediusmiter) {
        return queryErrorRelatedResponse(res, 400, "You are out of the coverage area.");
      }

      const workMillis = checkout - checkin;
      const workingTime = Math.floor(workMillis / 60000);

      const attendance = await Attendance.create({
        checkin,
        checkinLatitude,
        checkoutLongitude,
        location,
        day,
        user_id: id,
        checkout,
        checkoutLatitude,
        checkinLongitude,
        overtime: workingTime > setting.workingtime ? workingTime - setting.workingtime : 0,
        totalhour: workingTime,
        workingtime: setting.workingtime,
        radius: radius,
      });

      successResponse(res, attendance);
    } catch (axiosError) {
      console.error("Failed to get location from OpenStreetMap API", axiosError);
    }
  } catch (error) {
    next(error);
  }
};

const updateAttendance = async (req, res, next) => {
  try {
    const { id, day, checkin, checkinLatitude, checkinLongitude, checkout, checkoutLatitude, checkoutLongitude } =
      req.body;

    // Check if the attendance record exists
    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return queryErrorRelatedResponse(res, 404, "Attendance record not found.");
    }

    let location = req.body.location;

    try {
      // Only fetch the location if checkin coordinates are provided
      if (checkinLatitude && checkinLongitude) {
        const respo = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${checkinLatitude}&lon=${checkinLongitude}&format=json`
        );

        if (respo.data && respo.data.display_name) {
          location = respo.data.display_name;
        }
      }
    } catch (axiosError) {
      console.error("Failed to get location from OpenStreetMap API", axiosError);
      return queryErrorRelatedResponse(res, 500, "Location retrieval failed.");
    }

    const radius = calculateDistance(
      checkinLatitude ? checkinLatitude : attendance.checkinLatitude,
      checkinLongitude ? checkinLongitude : attendance.checkinLongitude,
      checkoutLatitude ? checkoutLatitude : attendance.checkoutLatitude,
      checkoutLongitude ? checkoutLongitude : attendance.checkoutLongitude
    );
    const setting = await Setting.findOne();
    if (!setting) {
      return queryErrorRelatedResponse(res, 500, "Server error: settings not found.");
    }
    if (radius > setting.rediusmiter) {
      return queryErrorRelatedResponse(res, 400, "You are out of the coverage area.");
    }

    const workMillis = (checkout || attendance.checkout) - (checkin || attendance.checkin);
    const workingTime = Math.floor(workMillis / 60000);

    // Update fields only if they are provided in the request
    if (checkin) attendance.checkin = checkin;
    if (checkinLatitude) attendance.checkinLatitude = checkinLatitude;
    if (checkinLongitude) attendance.checkinLongitude = checkinLongitude;
    if (checkout) attendance.checkout = checkout;
    if (checkoutLatitude) attendance.checkoutLatitude = checkoutLatitude;
    if (checkoutLongitude) attendance.checkoutLongitude = checkoutLongitude;
    if (location) attendance.location = location;
    if (day) attendance.day = day;

    // Calculate overtime and total hours
    attendance.overtime = workingTime > setting.workingtime ? workingTime - setting.workingtime : 0;
    attendance.totalhour = workingTime;
    attendance.workingtime = setting.workingtime;
    attendance.radius = radius;

    // Save the updated attendance record
    await attendance.save();

    successResponse(res, attendance);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAttendance,
  getUseridAttendance,
  checkIn,
  checkOut,
  addAttendance,
  updateAttendance,
  getMonthAttendance,
};
