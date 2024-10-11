const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema(
  {
    levaetype: {
      type: String,
      require: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    reson: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      require: true,
    },
    date: {
      type: Date,
    },
    todate: {
      type: Date,
    },
    hour: {
      type: String,
    },
    day: {
      type: String,
    },
    approveby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
    approvebyname: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Rejected", "Approved"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("leave", LeaveSchema);
