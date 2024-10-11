const jwt = require("jsonwebtoken");
const { queryErrorRelatedResponse } = require("./sendResponse");
const Admin = require("../model/Admin");

module.exports = async function (req, res, next) {
  let token = req.header("Authorization");
 
  if (token) {
    token = req.header("Authorization").replace("Bearer ", "");
  }

  if (!token) return queryErrorRelatedResponse(res, 402, "Access Denied.");
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    let admin = await Admin.findOne({ _id: verified._id });

    if (!admin) {
      return queryErrorRelatedResponse(res, 402, "Access Denied.");
    }

    req.admin = admin;
    req.token = token;
    next();
  } catch (error) {
    console.log(error);
    queryErrorRelatedResponse(res, 402, "Invalid Token.");
  }
};
