const Generalsetting = require("../../model/Generalsetting");
const { queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");

const addGeneralsetting = async (req, res, next) => {
  try {
    const { termsandcondition, privacypolicy, email, password } = req.body;
    const generalsetting = await Generalsetting.create({
      termsandcondition,
      privacypolicy,
      email,
      password,
    });

    successResponse(res, "Date add Successfully");
  } catch (error) {
    next(error);
  }
};

const getGeneralsetting = async (req, res, next) => {
  try {
    const generalsetting = await Generalsetting.findOne();

    successResponse(res, generalsetting);
  } catch (error) {
    next(error);
  }
};

const updateGeneralsetting = async (req, res, next) => {
  try {
    const generalsetting = await Generalsetting.findOne();
    if (!generalsetting) return queryErrorRelatedResponse(res, 404, "Settitng not found");

    req.body.termsandcondition
      ? (generalsetting.termsandcondition = req.body.termsandcondition)
      : generalsetting.termsandcondition;
    req.body.privacypolicy ? (generalsetting.privacypolicy = req.body.privacypolicy) : generalsetting.privacypolicy;
    req.body.email ? (generalsetting.email = req.body.email) : generalsetting.email;
    req.body.password ? (generalsetting.password = req.body.password) : generalsetting.password;
    req.body.mapapikey ? (generalsetting.mapapikey = req.body.mapapikey) : generalsetting.mapapikey;

    await generalsetting.save();
    successResponse(res, "Update Successfully");
  } catch (error) {
    next(error);
  }
};

const getMapApikey = async (req, res, next) => {
  try {
    const apikey = await Generalsetting.findOne();

    successResponse(res, apikey.mapapikey);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addGeneralsetting,
  getGeneralsetting,
  updateGeneralsetting,
  getMapApikey,
};
