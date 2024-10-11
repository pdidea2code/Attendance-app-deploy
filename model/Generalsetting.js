const mongoose = require("mongoose");
const GeneralsettingSchema = new mongoose.Schema(
  {
    termsandcondition: {
      type: String,
      default: "Terms & Condition",
    },
    privacypolicy: {
      type: String,
      default: "Privacy Policy",
    },
    email: {
      type: String,
      default: "example@gmail.com",
    },
    password: {
      type: String,
      default: "exam plea pass word",
    },
  },
  {
    timeseries: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("generalsetting", GeneralsettingSchema);
