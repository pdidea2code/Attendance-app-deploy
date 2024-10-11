const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Holiday = require("../../model/Holiday");

const addHoliday = async (req, res, next) => {
  try {
    const { date, title, day } = req.body;

    const dateParts = date.split("-");
    const holidayDate = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`);

    if (isNaN(holidayDate.getTime())) {
      return queryErrorRelatedResponse(res, 400, "Invalid date format.");
    }

    const holiday = await Holiday.create({
      date: holidayDate,
      title: title,
      day: day,
    });

    successResponse(res, "Add Successfully");
  } catch (error) {
    next(error);
  }
};

const getAllHolidays = async (req, res, next) => {
  try {
    const holidays = await Holiday.find();
    successResponse(res, holidays);
  } catch (error) {
    next(error);
  }
};

const updateHoliday = async (req, res, next) => {
  try {
    const { id, date, title, day } = req.body;

    const holiday = await Holiday.findById(id);
    if (!holiday) return queryErrorRelatedResponse(req, 404, "Holiday Not Found");

    if (date) {
      const dateParts = date.split("-");
      const holidayDate = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`);

      if (isNaN(holidayDate.getTime())) {
        return queryErrorRelatedResponse(res, 400, "Invalid date format.");
      }
      holiday.date = holidayDate;
    }

    if (title) {
      holiday.title = title;
    }
    if (day) {
      holiday.day = day;
    }

    await holiday.save();

    successResponse(res, "Holiday updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteHoliday = async (req, res, next) => {
  try {
    const { id } = req.params;
    const holiday = await Holiday.findById(id);
    if (!holiday) return queryErrorRelatedResponse(req, 404, "Holiday Not Found");

    await Holiday.deleteOne({ _id: id });

    successResponse(res, "Delete Successfully");
  } catch (error) {
    next(error);
  }
};

const deleteMultiHoliday = async (req, res, next) => {
  try {
    const { ids } = req.body;
    console.log(ids);
    const results = await Promise.all(
      ids.map(async (id) => {
        return await Holiday.deleteOne({ _id: id });
      })
    );

    successResponse(res, `Deleted ${results.length} holidays successfully`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addHoliday,
  getAllHolidays,
  updateHoliday,
  deleteHoliday,
  deleteMultiHoliday,
};
