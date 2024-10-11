const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Month = require("../../model/Month");

const addMonth = async (req, res, next) => {
  try {
    const { months, year, day } = req.body;
    const month = await Month.create({
      month: months,
      year: year,
      day: day,
    });

    successResponse(res, "Add Successfully");
  } catch (error) {
    next(error);
  }
};

const getMonth = async (req, res, next) => {
  try {
    const month = await Month.find();
    if (!month) return queryErrorRelatedResponse(res, 404, "month not found");

    successResponse(res, month);
  } catch (error) {
    next(error);
  }
};

const updateMonth = async (req, res, next) => {
  try {
    const { id, day, months, year } = req.body;
    const month = await Month.findById(id);
    if (!month) return queryErrorRelatedResponse(res, 404, "month not found");

    day ? (month.day = day) : month.day;
    months ? (month.month = months) : month.month;
    year ? (month.year = year) : month.year;

    await month.save();

    successResponse(res, "Update Succfully");
  } catch (error) {
    next(error);
  }
};

const deleteMonth = async (req, res, next) => {
  try {
    const month = await Month.findByIdAndDelete(req.params.id);
    if (!month) return queryErrorRelatedResponse(res, 404, "month not found");

    successResponse(res, "delete succfully");
  } catch (error) {
    next(error);
  }
};

const deleteMultiMonth = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const results = await Promise.all(
      ids.map(async (id) => {
        return await Month.deleteOne({ _id: id });
      })
    );

    successResponse(res, `Deleted ${results.length} months successfully`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMonth,
  getMonth,
  updateMonth,
  deleteMonth,
  deleteMultiMonth,
};
