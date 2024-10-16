const deleteFile = require("../../helper/deleteFile");
const { queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");
const { isValidPassword } = require("../../helper/validation");
const Attendance = require("../../model/Attendance");
const Leave = require("../../model/Leave");
const User = require("../../model/User");
const Notification = require("../../model/Notification");

const addUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      confpassword,
      name,
      user_id,
      position,
      phoneno,
      workplaceLatitude,
      workplaceLongitude,
      dob,
    } = req.body;

    if (password !== confpassword) {
      return queryErrorRelatedResponse(res, 400, "Confirm password does not match");
    }

    if (!isValidPassword(password))
      return queryErrorRelatedResponse(
        req,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );

    const user = await User.create({
      email: email,
      password: password,
      name: name,
      user_id: user_id,
      dob: dob,
      position: position,
      phoneno: phoneno,
      workplaceLatitude: workplaceLatitude,
      workplaceLongitude: workplaceLongitude,
      image: req.file ? req.file.filename : null,
    });

    successResponse(res, "Registration complete");
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return queryErrorRelatedResponse(res, 404, "No users found");
    }

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.ADMIN_PROFIILE_IMAGE;
    successResponse(res, users, baseUrl);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const {
      email,
      password,
      confpassword,
      dob,
      name,
      user_id,
      position,
      phoneno,
      workplaceLatitude,
      workplaceLongitude,
    } = req.body;

    if (!req.params.id) {
      return queryErrorRelatedResponse(res, 400, "User ID is required");
    }

    if (password || confpassword) {
      if (password !== confpassword) {
        return queryErrorRelatedResponse(res, 400, "Confirm password does not match");
      }
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return queryErrorRelatedResponse(res, 404, "User not found");
    }

    user.email = email ? email : user.email;

    if (password && confpassword) {
      if (!isValidPassword(password))
        return queryErrorRelatedResponse(
          res,
          400,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
      user.password = password;
    }
    console.log(dob);
    user.name = name ? name : user.name;
    user.user_id = user_id ? user_id : user.user_id;
    user.position = position ? position : user.position;
    user.phoneno = phoneno ? phoneno : user.phoneno;
    user.workplaceLatitude = workplaceLatitude ? workplaceLatitude : user.workplaceLatitude;
    user.workplaceLongitude = workplaceLongitude ? workplaceLongitude : user.workplaceLongitude;
    user.dob = dob ? dob : user.dob;

    if (req.file && req.file.filename) {
      if (user.image) {
        deleteFile("profileimg/" + user.image);
      }
      user.image = req.file.filename;
    }

    await user.save();

    successResponse(res, "User updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) queryErrorRelatedResponse(res, 404, "Not Found");

    await Attendance.deleteMany({ user_id: req.params.id });
    await Leave.deleteMany({ user_id: req.params.id });
    await Notification.deleteMany({ user_id: req.params.id });
    if (user.image) {
      deleteFile("profileimg/" + user.image);
    }
    await User.deleteOne({ _id: req.params.id });

    successResponse(res, "Delete Successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
