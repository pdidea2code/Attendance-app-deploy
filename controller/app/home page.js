const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Announcement = require("../../model/Announcement");
const Attendance = require("../../model/Attendance");
const Event = require("../../model/Event");
const Generalsetting = require("../../model/Generalsetting");
const Holiday = require("../../model/Holiday");
const Notification = require("../../model/Notification");
const Setting = require("../../model/Setting");

// const homepage = async (req, res, next) => {
//   try {
//     const currentDate = new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00";
//     const lastAttendance = await Attendance.find({ user_id: req.user._id }).sort({ createdAt: -1 });

//     const setting = await Setting.findOne();
//     const event = await Event.findOne({ date: currentDate });
//     const announcement = await Announcement.find({ status: true });
//     const attendance = {
//       day: lastAttendance.day,
//       checkin: lastAttendance.checkin,
//       checkout: lastAttendance.checkout,
//       overtime: lastAttendance.overtime,
//     };
//     const data = {
//       attendance,
//       baraktime: setting.breaktime,
//       event: event?.title,
//       announcement,
//     };
//     console.log(currentDate);
//     const baseUrl = req.protocol + "://" + req.get("host") + process.env.ANNOUNCEMENT_IMAGE;
//     successResponse(res, data, baseUrl);
//   } catch (error) {
//     next(error);
//   }
// };

const homepage = async (req, res, next) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0] + "T00:00:00.000+00:00";

    const todayAttendance = await Attendance.find({
      user_id: req.user._id,
      createdAt: {
        $gte: new Date(currentDate),
        $lt: new Date(new Date(currentDate).getTime() + 24 * 60 * 60 * 1000),
      },
    }).sort({ createdAt: 1 });

    let totalWorkMinutes = 0;
    todayAttendance.forEach((record) => {
      if (record.checkin && record.checkout) {
        const checkinTime = new Date(record.checkin).getTime();
        const checkoutTime = new Date(record.checkout).getTime();
        totalWorkMinutes += Number(record.workingtime);
      }
    });

    const setting = await Setting.findOne();
    const standardWorkMinutes = setting.workingtime;
    const overtimeMinutes = totalWorkMinutes > standardWorkMinutes ? totalWorkMinutes - standardWorkMinutes : 0;

    const lastAttendance = await Attendance.findOne({ user_id: req.user._id }).sort({ createdAt: -1 });

    const event = await Event.findOne({ date: currentDate });
    const announcement = await Announcement.find({ status: true });

    const attendanceSummary = {
      totalWorkTime: `${Math.floor(totalWorkMinutes)}`,
      overtime: `${Math.floor(overtimeMinutes)}`,
      lastAttendance: lastAttendance
        ? {
            checkin: lastAttendance.checkin,
            checkout: lastAttendance.checkout,
            day: lastAttendance.day,
          }
        : null,
    };

    const data = {
      attendance: attendanceSummary,
      breaktime: setting.breaktime,
      event: event?.title,
      announcement,
    };

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.ANNOUNCEMENT_IMAGE;
    successResponse(res, data, baseUrl);
  } catch (error) {
    next(error);
  }
};

const holidayList = async (req, res, next) => {
  try {
    const holiday = await Holiday.find();

    successResponse(res, holiday);
  } catch (error) {
    next(error);
  }
};

const generalSetting = async (req, res, next) => {
  try {
    const setting = await Generalsetting.findOne();
    if (!setting) queryErrorRelatedResponse(res, 500, "Setting data not found");
    const date = { termsandcondition: setting.termsandcondition, privacypolicy: setting.privacypolicy };

    successResponse(res, date);
  } catch (error) {
    next(error);
  }
};

const getNotification = async (req, res, next) => {
  try {
    const notification = await Notification.find({ user_id: req.user._id });

    if (!notification) return queryErrorRelatedResponse(res, 404, "Notification not found");

    successResponse(res, notification);
  } catch (error) {
    next(error);
  }
};
module.exports = { homepage, holidayList, generalSetting, getNotification };
