const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Attendance = require("../../model/Attendance");
const moment = require("moment");
const axios = require("axios");
const { calculateDistance, getPlaceName } = require("../../helper/calculateDistance");
const Setting = require("../../model/Setting");
const { retry } = require("@reduxjs/toolkit/query");
const Month = require("../../model/Month");
const User = require("../../model/User");

const checkIn = async (req, res, next) => {
  try {
    const lastAttendance = await Attendance.findOne({ user_id: req.user._id }).sort({ createdAt: -1 });
    if (lastAttendance && !lastAttendance.checkout) {
      return queryErrorRelatedResponse(res, 400, "You must check out first before checking in.");
    }

    const currentTime = new Date();
    // const currentTime = 1727440266216;
    const { checkinLatitude, checkinLongitude } = req.body;
    let location = req.body.location;

    const radius = calculateDistance(
      req.user.workplaceLatitude,
      req.user.workplaceLongitude,
      checkinLatitude,
      checkinLongitude
    );

    const setting = await Setting.findOne();
    if (!setting) {
      return queryErrorRelatedResponse(res, 500, "Server error: settings not found.");
    }

    if (radius > setting.rediusmiter) {
      return queryErrorRelatedResponse(res, 400, "You are out of the Work Place.");
    }
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
    // const place = await getPlaceName(checkinLatitude, checkinLongitude);
    // console.log(place);
    const attendance = await Attendance.create({
      user_id: req.user._id,
      checkin: currentTime,
      day: currentTime,
      checkinLatitude: checkinLatitude,
      checkinLongitude: checkinLongitude,
      workplaceLatitude: req.user.workplaceLatitude,
      workplaceLongitude: req.user.workplaceLongitude,
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

    const lastAttendance = await Attendance.findOne({ user_id: req.user._id }).sort({ createdAt: -1 });

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
      req.user.workplaceLatitude,
      req.user.workplaceLongitude,
      checkoutLatitude,
      checkoutLongitude
    );

    if (radius > setting.rediusmiter) {
      return queryErrorRelatedResponse(res, 400, "You are out of the Work Place.");
    }

    const workMillis = currentTime - lastAttendance.checkin;
    const workingTime = Math.floor(workMillis / 60000);

    lastAttendance.overtime = workingTime > setting.workingtime ? workingTime - setting.workingtime : 0;
    lastAttendance.totalhour = workingTime;
    lastAttendance.workingtime = workingTime < setting.workingtime ? workingTime : setting.workingtime;
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

// const getAttendance = async (req, res, next) => {
//   try {
//     function getMonthTimestampRange(year, month) {
//       const paddedMonth = String(month).padStart(2, "0");
//       const startDate = moment(`${year}-${paddedMonth}-01`, "YYYY-MM-DD");
//       const endDate = moment(startDate).endOf("month");

//       const startTimestamp = startDate.valueOf();
//       const endTimestamp = endDate.valueOf();
//       const daysInMonth = startDate.daysInMonth();

//       return {
//         startTimestamp,
//         endTimestamp,
//         daysInMonth,
//       };
//     }

//     // Default to current month and year if not provided
//     if (!req.body.year || !req.body.month) {
//       req.body.month = moment().month() + 1;
//       req.body.year = moment().year();
//     }

//     const range = getMonthTimestampRange(req.body.year, req.body.month); // Correct the order

//     // Fetch attendance
//     // const attendance = await Attendance.findOne({ user_id: req.user._id }).sort({ createdAt: -1 });

//     const attendances = await Attendance.find({
//       user_id: req.user._id,
//       day: { $gte: range.startTimestamp, $lt: range.endTimestamp },
//     });

//     // if (attendances.length <= 0) {
//     //    queryErrorRelatedResponse(res, 400, "Attendance not found");
//     // }

//     let totalhour = 0;
//     let totalworkingtime = 0;
//     let totoalovertime = 0;
//     let totoalattengance = 0;
//     let workingdays = 0;

//     const workingdayss = await Month.findOne({ month: req.body.month, year: req.body.year });

//     if (workingdayss && workingdayss.day) {
//       workingdays = workingdayss.day;
//     }

//     attendances.forEach((data) => {
//       totalhour += Number(data.totalhour) || 0;
//       totalworkingtime += Number(data.workingtime) || 0;
//       totoalovertime += Number(data.overtime) || 0;

//       totoalattengance = totoalattengance + (data.checkout ? 1 : 0);
//     });

//     // const selectedMonth = moment(`${req.body.year}-${req.body.month}`).daysInMonth();

//     const total = {
//       totalhour,
//       totalworkingtime,
//       totoalovertime,
//       totoalattengance,
//       workingdays: workingdays,
//       daysInMonth: range.daysInMonth,
//     };

//     const data = {
//       total,
//       attendances: attendances ? attendances : "Attendance not found",
//     };

//     successResponse(res, data);
//   } catch (error) {
//     next(error);
//   }
// };

const getAttendance = async (req, res, next) => {
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

    const attendances = await Attendance.find({
      user_id: req.user._id,
      day: { $gte: range.startTimestamp, $lt: range.endTimestamp },
    });

    let totalhour = 0;
    let totalworkingtime = 0;
    let totalovertime = 0;
    let totalattendance = 0;
    let workingdays = 0;

    const workingdayss = await Month.findOne({ month: req.body.month, year: req.body.year });
    if (workingdayss && workingdayss.day) {
      workingdays = workingdayss.day;
    }

    const uniqueDates = new Set();

    attendances.forEach((data) => {
      totalhour += Number(data.totalhour) || 0;
      totalworkingtime += Number(data.workingtime) || 0;
      totalovertime += Number(data.overtime) || 0;

      if (data.checkout) {
        const dateKey = moment(data.day).format("YYYY-MM-DD");
        uniqueDates.add(dateKey);
      }
    });

    totalattendance = uniqueDates.size;

    const total = {
      totalhour,
      totalworkingtime,
      totalovertime,
      totalattendance,
      workingdays,
      daysInMonth: range.daysInMonth,
    };

    const data = {
      total,
      attendances: attendances.length > 0 ? attendances : "Attendance not found",
    };

    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkIn,
  getAttendance,
  checkOut,
};
