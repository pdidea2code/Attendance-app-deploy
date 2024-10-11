const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      require: true,
    },
    title: {
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

module.exports = mongoose.model("event", EventSchema);
