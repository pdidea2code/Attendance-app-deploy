const Role = require("../model/Role");
const { queryErrorRelatedResponse } = require("./sendResponse");

const roleManager = async (req, res, next) => {
  try {
    const role = await Role.findById(req.admin.role);

    if (role.name !== "superadmin") {
      queryErrorRelatedResponse(res, 400, "Invalid Access");
    } else {
      next();
    }
  } catch (error) {
    queryErrorRelatedResponse(res, 400, "Invalid Access");
  }
};

module.exports = roleManager;
