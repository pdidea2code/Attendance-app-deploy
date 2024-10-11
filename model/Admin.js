const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const AdminSchema = new mongoose.Schema(
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
    password: {
      type: String,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
    },
    expireOtpTime: {
      type: String,
      default: null,
    },

    image: {
      type: String,
      default: null,
    },
    resetCode: {
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

AdminSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hashSync(user.password, 12);
  }
  next();
});

AdminSchema.methods.generateAuthToken = function (data) {
  const user = this;
  const id = { _id: user._id };
  data = { ...data, ...id };
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1000m" });
  return token;
};

AdminSchema.methods.generateRefreshToken = function (data) {
  const user = this;
  const id = { _id: user._id };
  data = { ...data, ...id };
  const token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
  return token;
};

AdminSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.log(error);
    throw new Error("Error comparing passwords");
  }
};

module.exports = mongoose.model("admin", AdminSchema);
