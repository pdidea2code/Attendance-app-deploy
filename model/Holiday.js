const mongoose = require("mongoose");

const HolidaySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    date: {
      type: Date,
      require: true,
    },
    day: {
      type: String,
      require: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("holiday", HolidaySchema);
