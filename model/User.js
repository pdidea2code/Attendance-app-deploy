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
      type: Number,
      // unique: true, // Ensures uniqueness
      sparse: true, // Allows null or undefined values
      // required: [true, 'Phone number is required'],  // Field must be present
      min: [1000000000, "Phone number must be at least 10 digits"], // Minimum value for 10-digit numbers
      max: [9999999999, "Phone number cannot exceed 10 digits"], // Max value for 10-digit numbers
      validate: {
        validator: function (v) {
          // Custom validation: Checks if it's a 10-digit number
          return /^\d{10}$/.test(v.toString());
        },
        message: (props) => `${props.value} is not a valid 10-digit phone number!`,
      },
    },
    user_id: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      // validate: {
      //   validator: function (v) {
      //     // Regular expression for password validation
      //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      //   },
      //   message:
      //     "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      // },
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
    dob: {
      type: String,
    },
    fcm_token: {
      type: String,
      default: null,
    },
    // role_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "role",
    // },
    // workinghoures: {
    //   type: String,
    //   default: null,
    // },
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
