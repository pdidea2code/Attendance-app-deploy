const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    checkin: {
      type: Number,
    },
    checkinLatitude: {
      type: String,
    },
    checkinLongitude: {
      type: String,
    },
    checkout: {
      type: Number,
      default: null,
    },
    checkoutLatitude: {
      type: String,
      default: null,
    },
    checkoutLongitude: {
      type: String,
      default: null,
    },
    workplaceLatitude: {
      type: String,
      require: true,
      // default: null,
    },
    workplaceLongitude: {
      type: String,
      require: true,
      // default: null,
    },
    workingtime: {
      type: String,
      default: null,
    },
    totalhour: {
      type: String,
      default: null,
    },
    overtime: {
      type: String,
      default: null,
    },
    location: {
      type: String,
    },
    radius: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("attendance", AttendanceSchema);
