const Permission = require("../model/Permission");
const Role = require("../model/Role");
const RolehasePermission = require("../model/Rolehasepermission");
const { queryErrorRelatedResponse } = require("./sendResponse");

const permissionManage = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const role = await Role.findById(req.admin.role);

      if (!role) {
        return queryErrorRelatedResponse(res, 400, "Role not found.");
      }

      const permissions = await RolehasePermission.find({ role_id: role._id });

      if (!permissions || permissions.length === 0) {
        return queryErrorRelatedResponse(res, 400, "Permissions not found.");
      }

      const permission = await Promise.all(
        permissions.map(async (data) => {
          const permission = await Permission.findOne({ _id: data.permission_id });
          return permission.name;
        })
      );

      if (!permission.includes(requiredPermission)) {
        return queryErrorRelatedResponse(res, 403, "Forbidden: You do not have the required permission.");
      }

      next();
    } catch (error) {
      console.error(error);
      queryErrorRelatedResponse(res, 500, "Internal Server Error.");
    }
  };
};

module.exports = permissionManage;
