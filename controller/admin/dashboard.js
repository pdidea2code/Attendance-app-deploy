const { getDateTimestamp } = require("../../helper/calculateDistance");
const { successResponse } = require("../../helper/sendResponse");
const Attendance = require("../../model/Attendance");
const Holiday = require("../../model/Holiday");
const Leave = require("../../model/Leave");
const User = require("../../model/User");

// const getAttendanceCount = async (req, res, next) => {
//   try {
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);

//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999);

//     const attendance = await Attendance.find({
//       day: {
//         $gte: startOfDay,
//         $lte: endOfDay,
//       },
//     });

//     const user = await User.find();

//     const leave = await Leave.find({
//       $or: [
//         {
//           date: {
//             $gte: startOfDay,
//             $lte: endOfDay,
//           },
//           $or: [{ todate: { $exists: false } }, { $expr: { $eq: ["$date", "$todate"] } }],
//         },

//         {
//           date: { $lte: endOfDay },
//           todate: { $gte: startOfDay },
//         },
//       ],
//     });

//     const checkin = attendance.filter((data) => data.checkin);
//     const checkout = attendance.filter((data) => data.checkout);

//     const data = {
//       checkin: checkin.length,
//       checkout: checkout.length,
//       total: user.length,
//       leave: leave.length,
//     };

//     successResponse(res, data);
//   } catch (error) {
//     next(error);
//   }
// };

const getAttendanceCount = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      day: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const users = await User.find();

    const leaves = await Leave.find({
      $or: [
        {
          date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
          type: { $ne: "Hour" },
        },
        {
          date: { $lte: endOfDay },
          todate: { $gte: startOfDay },
        },
        {
          date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
          type: "Hour",
        },
      ],
      status: "Approved",
    });

    const holiday = await Holiday.findOne({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const checkin = attendance.filter((data) => data.checkin);
    const checkout = attendance.filter((data) => data.checkout);

    const data = {
      checkin: checkin.length,
      checkout: checkout.length,
      total: users.length,
      leave: leaves.length,
      holiday,
    };

    successResponse(res, data);
  } catch (error) {
    next(error);
  }
};

const leaveRequest = async (req, res, next) => {
  try {
    const leave = await Leave.find({ status: "Pending" }).populate("user_id");
    if (!leave) return queryErrorRelatedResponse(res, 404, "Leave Request Not Found");

    successResponse(res, leave);
  } catch (error) {
    next(error);
  }
};
module.exports = { getAttendanceCount, leaveRequest };
