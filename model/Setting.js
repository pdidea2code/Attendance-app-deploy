const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
  workingtime: {
    type: Number,
    // default: "540",
  },
  breaktime: {
    type: Number,
    // default: "60",
  },
  rediusmiter: {
    type: Number,
    // default: "100",
  },
});

module.exports = mongoose.model("setting", SettingSchema);
