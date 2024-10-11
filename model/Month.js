const mongoose = require("mongoose");
const MonthSchema = new mongoose.Schema(
  {
    month: {
      type: Number,
      require: true,
    },
    year: {
      type: Number,
      require: true,
    },
    day: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("monthe", MonthSchema);
