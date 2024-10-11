const deleteFile = require("../../helper/deleteFile");
const { queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");
const User = require("../../model/User");

const addUser = async (req, res, next) => {
  try {
    const { email, password, confpassword, name, user_id, position, phoneno } = req.body;

    if (password !== confpassword) {
      return queryErrorRelatedResponse(res, 400, "Confirm password does not match");
    }

    const user = await User.create({
      email: email,
      password: password,
      name: name,
      user_id: user_id,
      position: position,
      phoneno: phoneno,
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
    const { email, password, confpassword, name, user_id, position, phoneno } = req.body;

    if (!req.params.id) {
      return queryErrorRelatedResponse(res, 400, "User ID is required");
    }

    console.log(req.params.id);

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
      user.password = password;
    }

    user.name = name ? name : user.name;
    user.user_id = user_id ? user_id : user.user_id;
    user.position = position ? position : user.position;
    user.phoneno = phoneno ? phoneno : user.phoneno;

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

module.exports = {
  addUser,
  getAllUsers,
  updateUser,
};
