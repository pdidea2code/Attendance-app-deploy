const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Setting = require("../../model/Setting");

const addSetting = async (req, res, next) => {
  try {
    const { workingtime, breaktime, rediusmiter } = req.body;
    const setting = await Setting.create({
      workingtime: workingtime,
      breaktime: breaktime,
      rediusmiter: rediusmiter,
    });

    successResponse(res, "setting add successfully");
  } catch (error) {
    next(error);
  }
};

const updateSetting = async (req, res, next) => {
  try {
    const { workingtime, breaktime, rediusmiter } = req.body;

    const setting = await Setting.findOne();

    if (!setting) return queryErrorRelatedResponse(req, 404, "not found");

    workingtime ? (setting.workingtime = workingtime) : setting.workingtime;
    breaktime ? (setting.breaktime = breaktime) : setting.breaktime;
    rediusmiter ? (setting.rediusmiter = rediusmiter) : setting.rediusmiter;

    await setting.save();

    successResponse(res, "Update Successfully");
  } catch (error) {
    next(error);
  }
};

const getSetting = async (req, res, next) => {
  try {
    const setting = await Setting.findOne();
    if (!setting) return queryErrorRelatedResponse(res, 404, "setting not found");

    successResponse(res, setting);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addSetting,
  updateSetting,
  getSetting,
};
