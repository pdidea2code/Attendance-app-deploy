const deleteFile = require("../../helper/deleteFile");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Role = require("../../model/Role");
const RolehasePermission = require("../../model/Rolehasepermission");
const User = require("../../model/User");

const addRole = async (req, res, next) => {
  try {
    const { name, permission } = req.body;

    // Create the new role with permissions
    const role = await Role.create({
      name,
    });

    // Add permissions to the new role
    await Promise.all(
      permission.map(async (perm) => {
        const rolehasepermission = await RolehasePermission.findOne({ role_id: role._id, permission_id: perm });
        if (!rolehasepermission) {
          await RolehasePermission.create({
            role_id: role._id,
            permission_id: perm,
          });
        }
      })
    );

    successResponse(res, role);
  } catch (error) {
    next(error);
  }
};

const getAllRole = async (req, res, next) => {
  try {
    const role = await Role.find();
    const permission = await Promise.all(
      role.map(async (data) => {
        const permission = await RolehasePermission.find({ role_id: data._id }).populate("permission_id");
        const permissiondetail = permission.map((data) => {
          return data.permission_id.name;
        });

        return {
          _id: data._id,
          name: data.name,
          permission: permissiondetail,
        };
      })
    );

    successResponse(res, permission);
  } catch (error) {
    next(error);
  }
};

const changePermission = async (req, res, next) => {
  try {
    const { name, permission } = req.body;

    if (!name || !permission) {
      return queryErrorRelatedResponse(res, 400, "Name and permission are required.");
    }

    const role = await Role.findOne({ _id: req.body.id });

    if (!role) {
      return queryErrorRelatedResponse(res, 404, "Role not found.");
    }

    const existingPermissions = await RolehasePermission.find({ role_id: role._id });

    // Remove permissions that are not in the new list
    await Promise.all(
      existingPermissions.map(async (data) => {
        if (!permission.includes(data.permission_id)) {
          await RolehasePermission.deleteOne({ role_id: role._id, permission_id: data.permission_id });
        }
      })
    );

    // Add new permissions
    await Promise.all(
      permission.map(async (perm) => {
        const rolehasepermission = await RolehasePermission.findOne({ role_id: role._id, permission_id: perm });
        if (!rolehasepermission) {
          await RolehasePermission.create({
            role_id: role._id,
            permission_id: perm,
          });
        }
      })
    );
    req.body.name ? (role.name = req.body.name) : role.name;
    // Uncomment and use if needed
    // if (!["insert", "update", "delete"].includes(permission)) {
    //   return queryErrorRelatedResponse(res, 400, "Invalid permission field.");
    // }
    // role[permission] = !role[permission];

    await role.save();

    successResponse(res, "Permission updated successfully.", role);
  } catch (error) {
    next(error);
  }
};

const getRolle = async (req, res, next) => {
  try {
    const role = await Role.findOne({ _id: req.admin.role });

    if (!role) return queryErrorRelatedResponse(res, 400, "Invalid Role");

    const permission = await RolehasePermission.find({ role_id: role._id }).populate("permission_id");

    const permissiondetail = permission
      .map((perm) => {
        return perm.permission_id.name;
      })
      .sort((a, b) => a.localeCompare(b));

    const roleData = {
      _id: role._id,
      role: role.name, // Assuming 'name' field for role
      permissions: permissiondetail,
    };

    successResponse(res, roleData);
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.body.id);
    if (!role) return queryErrorRelatedResponse(res, 404, "Role Not Found");

    const users = await User.find({ role: req.body.id });
    const user = await Promise.all(
      users.map(async (data) => {
        if (data.image) {
          deleteFile("profileimg/" + data.image);
        }
        await User.deleteOne(data._id);
      })
    );
    await RolehasePermission.deleteMany({ role_id: req.body.id });
    await Role.deleteOne({ _id: req.body.id });
    successResponse(res, "delete Successfully");
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.body.id);
    if (!role) return queryErrorRelatedResponse(res, "Role Not Found");

    req.body.name ? (role.name = req.body.name) : role.name;
  } catch (error) {
    next(error);
  }
};

module.exports = { addRole, changePermission, getAllRole, getRolle, deleteRole, updateRole };
