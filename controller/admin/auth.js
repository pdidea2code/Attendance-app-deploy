const { sendMail } = require("../../helper/emailSender");
const { successResponse, createResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Role = require("../../model/Role");
const Admin = require("../../model/Admin");
const jwt = require("jsonwebtoken");
const email_URL = process.env.Email_URL;
const crypto = require("crypto");
const deleteFile = require("../../helper/deleteFile");

const Signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const adminRole = role || "admin";

    const roleDoc = await Role.findOne({ name: adminRole });
    if (!roleDoc) {
      return queryErrorRelatedResponse(res, 400, "Role not found");
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      image: req.file ? req.file.filename : null,
      role: roleDoc._id,
    });

    createResponse(res, admin);
  } catch (error) {
    next(error);
  }
};

const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email }).populate("role");
    if (!admin) {
      return queryErrorRelatedResponse(res, 400, "Invalid Detail");
    }

    const Checkpassword = await admin.comparePassword(password);
    if (!Checkpassword) {
      return queryErrorRelatedResponse(res, 400, "Invalid Password");
    }

    const token = await admin.generateAuthToken({ email: admin.email });
    const refreshToken = await admin.generateRefreshToken({ email: admin.email });
    admin.token = token;
    await admin.save();

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.ADMIN_PROFIILE_IMAGE;
    const data = {
      admin,
      token,
      refreshToken,
    };
    successResponse(res, data, baseUrl);
  } catch (error) {
    next(error);
  }
};

const RefreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return queryErrorRelatedResponse(res, 401, "Access Denied. No refresh token provided");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const admin = await Admin.findOne({ email: decoded.email });
    if (!admin) {
      return queryErrorRelatedResponse(res, 401, "Invalid Admin!");
    }

    const accessToken = admin.generateAuthToken({ email: admin.email });

    successResponse(res, accessToken);
  } catch (error) {
    next(error);
  }
};

//Forgot Password - Check Email Id
const checkEmailId = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return queryErrorRelatedResponse(res, 401, "Invalid Admin");

    const resetCode = crypto.randomBytes(32).toString("hex");
    admin.expireOtpTime = Date.now() + 15 * 60 * 1000;
    const resetLink = `${email_URL}resetpassword/${resetCode}/${admin._id}`;

    const mail = await sendMail(
      {
        from: process.env.SMTP_EMAIL,
        to: admin.email,
        sub: "ATTEND ACE - Forgot Password",
        htmlFile: "./views/forgotpasswordlink.html",
        extraData: {
          resetLink: resetLink,
        },
      },
      req,
      res
    );
    // if (!mail) return queryErrorRelatedResponse(res, 404, "Email not send");

    admin.resetCode = resetCode;
    await admin.save();

    // successResponse(res, "OTP send successfully");
  } catch (error) {
    next(error);
  }
};

const verifyLink = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ _id: req.body.id, resetCode: req.body.resetCode });

    if (!admin) return queryErrorRelatedResponse(res, 401, "Invalid Detail");

    if (admin.expireOtpTime < Date.now()) {
      return queryErrorRelatedResponse(res, 401, "Link is Expired!");
    }

    successResponse(res, "Link verified");
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { id, resetCode, password, confpassword } = req.body;

    const admin = await Admin.findOne({ _id: id, resetCode: resetCode });
    if (!admin) return queryErrorRelatedResponse(res, 401, "Admin Not Found");
    if (confpassword !== password) {
      return queryErrorRelatedResponse(res, 400, "Confirm password not matche");
    }
    admin.password = password;
    admin.resetCode = null;
    await admin.save();
    successResponse(res, "password change successfully");
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { password, newPassword, confirmPassword } = req.body;

    const admin = await Admin.findById(req.admin._id);
    if (!admin) return queryErrorRelatedResponse(res, 401, "admin Not Found");

    const verifyPassword = await admin.comparePassword(password);
    if (!verifyPassword) return queryErrorRelatedResponse(res, 401, "Invalid Old Password");

    if (newPassword !== confirmPassword) {
      return queryErrorRelatedResponse(res, 404, "Confirm password does not match.");
    }

    admin.password = newPassword;

    await admin.save();
    successResponse(res, "Password changed successfully!");
  } catch (error) {
    next(error);
  }
};

const changeProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const admin = await Admin.findOne({ _id: req.admin._id });
    if (!admin) queryErrorRelatedResponse(res, 404, "Invalid User");

    name ? (admin.name = name) : admin.name;
    email ? (admin.email = email) : admin.email;
    let baseUrl = null;
    if (req.file && req.file.filename) {
      deleteFile("profileimg/" + admin.image);
      admin.image = req.file.filename;
      baseUrl = req.protocol + "://" + req.get("host") + process.env.ADMIN_PROFIILE_IMAGE + req.file.filename;
    } else {
      baseUrl = req.protocol + "://" + req.get("host") + process.env.ADMIN_PROFIILE_IMAGE + admin.image;
    }
    await admin.save();

    successResponse(res, "Profile Update Successfully", baseUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  Signup,
  Login,
  RefreshToken,
  checkEmailId,
  verifyLink,
  changePassword,
  resetPassword,
  changeProfile,
};
