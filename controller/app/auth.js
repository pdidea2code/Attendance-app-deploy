const { sendMail } = require("../../helper/emailSender");
const { queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");
const User = require("../../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Register = async (req, res, next) => {
  try {
    const { email, password, confpassword } = req.body;

    if (password !== confpassword) {
      return queryErrorRelatedResponse(res, 400, "Confirm password does not match");
    }

    const user = await User.create({
      email: email,
      password: password,
    });

    successResponse(res, "Registration complete ");
  } catch (error) {
    next(error);
  }
};

const Login = async (req, res, next) => {
  try {
    let user;

    // Google login
    if (req.body.google_id) {
      user = await User.findOne({ google_id: req.body.google_id });
      if (!user) {
        user = await User.create({
          google_id: req.body.google_id,
        });
      }
      const token = await user.generateAuthToken();
      const refreshToken = await user.generateRefreshToken();
      const data = {
        token,
        refreshToken,
        user,
      };
      return successResponse(res, data);
    }

    // Apple login (similar to Google login)
    if (req.body.apple_id) {
      user = await User.findOne({ apple_id: req.body.apple_id });
      if (!user) {
        user = await User.create({
          apple_id: req.body.apple_id,
        });
      }
      const token = await user.generateAuthToken();
      const refreshToken = await user.generateRefreshToken();
      const data = {
        token,
        refreshToken,
        user,
      };
      return successResponse(res, data);
    }

    // Email login
    if (req.body.email) {
      user = await User.findOne({ email: req.body.email });
      if (!user) {
        return queryErrorRelatedResponse(res, 404, "User not found");
      }

      const isPasswordCorrect = await user.comparePassword(req.body.password);
      if (!isPasswordCorrect) {
        return queryErrorRelatedResponse(res, 400, "Wrong password");
      }

      const token = await user.generateAuthToken();
      const refreshToken = await user.generateRefreshToken();
      const baseUrl = req.protocol + "://" + req.get("host") + process.env.USER_PROFIILE_IMAGE;
      const data = {
        token,
        refreshToken,
        user,
      };
      return successResponse(res, data, baseUrl);
    }
  } catch (error) {
    next(error);
  }
};

const RefreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return queryErrorRelatedResponse(res, 401, "Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      return queryErrorRelatedResponse(res, 401, "Invalid User!");
    }

    const accessToken = user.generateAuthToken({ email: user.email });

    successResponse(res, accessToken);
  } catch (error) {
    next(error);
  }
};

//Forgot Password - Check Email Id
const checkEmailId = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return queryErrorRelatedResponse(res, 401, "Invalid email Id");
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const expirationTime = Date.now() + 5 * 60 * 1000;

    const mail = await sendMail({
      from: process.env.SMTP_EMAIL,
      to: user.email,
      sub: "ATTEND ACE - Forgot Password",
      htmlFile: "./views/email_otp.html",
      extraData: {
        otp: otp,
      },
    });

    user.otp = otp;
    user.expireOtpTime = expirationTime;
    await user.save();

    // successResponse(res, "Check your email for the OTP");
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email, otp: req.body.otp });
    if (!user) return queryErrorRelatedResponse(res, 401, "Invalid Detail");

    if (user.expireOtpTime < Date.now()) {
      return queryErrorRelatedResponse(res, 401, "OTP is Expired!");
    }

    successResponse(res, "OTP verification complete");
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, password, confpassword } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) return queryErrorRelatedResponse(res, 401, "User Not Found");

    if (confpassword !== password) {
      return queryErrorRelatedResponse(res, 400, "Confirm password not matche");
    }
    user.password = password;
    user.resetCode = null;
    await user.save();
    successResponse(res, "password change successfully");
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return queryErrorRelatedResponse(res, 401, "user Not Found");

    const verifyPassword = await user.comparePassword(password);
    if (!verifyPassword) return queryErrorRelatedResponse(res, 401, "Invalid Old Password");

    if (newPassword !== confirmPassword) {
      return queryErrorRelatedResponse(res, 404, "Confirm password does not match.");
    }

    user.password = newPassword;

    await user.save();
    successResponse(res, "Password changed successfully!");
  } catch (error) {
    next(error);
  }
};

const adduserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return queryErrorRelatedResponse(res, 401, "User Not Found");

    const { name, user_id, position, phoneno } = req.body;

    user.name = name;
    user.user_id = user_id;
    user.position = position;
    user.phoneno = phoneno;
    user.image = req.file ? req.file.filename : null;
    await user.save();
    successResponse(res, user);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  Register,
  Login,
  RefreshToken,
  checkEmailId,
  verifyOtp,
  resetPassword,
  changePassword,
  adduserProfile,
};
