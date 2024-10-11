const { successResponse } = require("../../helper/sendResponse");
const Permission = require("../../model/Permission");
const RolehasePermission = require("../../model/Rolehasepermission");

// Add Permission
const addPermission = async (req, res, next) => {
  try {
    const permission = await Permission.create({
      name: req.body.name,
    });
    successResponse(res, permission);
  } catch (error) {
    next(error);
  }
};

// Get All Permissions
const getPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.find().sort({ name: 1 });
    successResponse(res, permissions);
  } catch (error) {
    next(error);
  }
};

// Delete Permission
const deletePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const permission = await Permission.findByIdAndDelete(id);
    const rolehasepermission = await RolehasePermission.deleteMany({ permission_id: permission._id });
    if (!permission) {
      return successResponse(res, { message: "Permission not found" });
    }
    successResponse(res, { message: "Permission deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { addPermission, getPermissions, deletePermission };
