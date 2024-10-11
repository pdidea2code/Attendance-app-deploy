const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { queryErrorRelatedResponse } = require("./sendResponse");

module.exports = async function (req, res, next) {
  let token = req.header("Authorization");

  if (token) {
    token = req.header("Authorization").replace("Bearer ", "");
  }

  if (!token) return queryErrorRelatedResponse(res, 402, "Access Denied.");
  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    let user = await User.findOne({ _id: verified._id });

    if (!user) {
      return queryErrorRelatedResponse(res, 402, "Access Denied.");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    queryErrorRelatedResponse(res, 402, "Invalid Token.");
  }
};
