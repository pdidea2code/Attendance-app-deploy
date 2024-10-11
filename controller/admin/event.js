const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Event = require("../../model/Event");

const addEvent = async (req, res, next) => {
  try {
    const { date, title } = req.body;

    const dateParts = date.split("-");
    const eventDate = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`);

    if (isNaN(eventDate.getTime())) {
      return queryErrorRelatedResponse(res, 400, "Invalid date format.");
    }

    await Event.create({ date: eventDate, title });

    successResponse(res, "Event added successfully");
  } catch (error) {
    next(error);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    successResponse(res, events);
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id, date, title } = req.body;

    const event = await Event.findById(id);
    if (!event) return queryErrorRelatedResponse(req, 404, "Event Not Found");

    if (date) {
      const dateParts = date.split("-");
      const eventDate = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`);

      if (isNaN(eventDate.getTime())) {
        return queryErrorRelatedResponse(res, 400, "Invalid date format");
      }
      event.date = eventDate;
    }

    if (title) {
      event.title = title;
    }

    await event.save();

    successResponse(res, "Event updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) return queryErrorRelatedResponse(req, 404, "Event Not Found");

    await Event.deleteOne({ _id: id });

    successResponse(res, "Delete Successfully");
  } catch (error) {
    next(error);
  }
};

const deleteMultiEvent = async (req, res, next) => {
  try {
    const { ids } = req.body;
    console.log(ids);
    const results = await Promise.all(
      ids.map(async (id) => {
        return await Event.deleteOne({ _id: id });
      })
    );

    successResponse(res, `Deleted ${results.length} events successfully`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  deleteMultiEvent,
};
