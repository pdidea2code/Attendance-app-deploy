const deleteFile = require("../../helper/deleteFile");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Admin = require("../../model/Admin");
const Role = require("../../model/Role");

const getAllAdmin = async (req, res, next) => {
  try {
    
    const admin = await Admin.find().populate("role");
    const baseUrl = req.protocol + "://" + req.get("host") + process.env.ADMIN_PROFIILE_IMAGE;

    const data = admin.map((data) => {
      return {
        _id: data._id,
        name: data.name,
        email: data.email,
        image: data.image,
        createdAt: data.createdAt,
        role_id: data.role._id,
        role_name: data.role.name,
      };
    });
    successResponse(res, data, baseUrl);
  } catch (error) {
    next(error);
  }
};

const addAdmin = async (req, res, next) => {
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

    successResponse(res, admin);
  } catch (error) {
    next(error);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    const adminRole = role || "admin";

    const roleDoc = await Role.findOne({ name: adminRole });
    if (!roleDoc) {
      return queryErrorRelatedResponse(res, 400, "Role not found");
    }

    if (!req.params.id) {
      return queryErrorRelatedResponse(res, 400, "User ID is required");
    }

    console.log(req.params.id);

    const admin = await Admin.findById(req.params.id); // Fetch admin by ID
    if (!admin) {
      return queryErrorRelatedResponse(res, 404, "User not found");
    }

    // Update fields conditionally
    admin.email = email || admin.email;

    if (password) {
      admin.password = password; // Ensure password is hashed before saving
    }

    admin.name = name || admin.name;
    admin.role = roleDoc._id;

    // Handle file upload and deletion
    if (req.file && req.file.filename) {
      if (admin.image) {
        deleteFile("profileimg/" + admin.image);
      }
      admin.image = req.file.filename;
    }

    await admin.save(); // Save the updated admin document

    successResponse(res, "User updated successfully"); // Send success response
  } catch (error) {
    next(error); // Pass error to error handler
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return queryErrorRelatedResponse(req, 404, "Data Not Found");

    if (admin.image) {
      deleteFile("profileimg/" + admin.image);
    }
    await Admin.deleteOne({ _id: req.params.id });

    successResponse(res, "Delete Successfully");
  } catch (error) {
    next(error);
  }
};

const deleteManyAdmin = async (req, res, next) => {
  try {
    const { ids } = req.body;
    console.log(ids);
    // const admin = await Promise.all(
    //   ids.map(async (id) => {
    //     const admin = await Admin.findByIdAndDelete(id);
    //     if (admin.image) {
    //       deleteFile("profileimg/" + admin.image);
    //     }
    //   })
    // );
    successResponse(res, "Delete Successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAdmin,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  deleteManyAdmin,
};
