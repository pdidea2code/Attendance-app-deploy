const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    phoneno: {
      type: String,
      default: null,
    },
    user_id: {
      type: String,
      default: null,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
      default: null,
    },
    google_id: {
      type: String,
      unique: true,
      sparse: true,
    },
    apple_id: {
      type: String,
      unique: true,
      sparse: true,
    },
    fcm_token: {
      type: String,
      default: null,
    },
    // role_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "role",
    // },
    workinghoures: {
      type: String,
      default: null,
    },
    position: {
      type: String,
      default: null,
    },
    otp: {
      type: String,
      default: null,
    },
    expireOtpTime: {
      type: String,
      default: null,
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

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hashSync(user.password, 12);
  }
  next();
});

UserSchema.methods.generateAuthToken = function (data) {
  const user = this;
  const id = { _id: user._id };
  data = { ...data, ...id };
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "300m" });
  return token;
};

UserSchema.methods.generateRefreshToken = function (data) {
  const user = this;
  const id = { _id: user._id };
  data = { ...data, ...id };
  const token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
  return token;
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.log(error);
    throw new Error("Error comparing passwords");
  }
};

module.exports = mongoose.model("user", UserSchema);
