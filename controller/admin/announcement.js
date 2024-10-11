const deleteFile = require("../../helper/deleteFile");
const { successResponse, queryErrorRelatedResponse } = require("../../helper/sendResponse");
const Announcement = require("../../model/Announcement");

const addAnnouncement = async (req, res, next) => {
  try {
    const { title, description, date } = req.body;
    const announcement = await Announcement.create({
      title: title,
      description: description,
      date: date,
      image: req.file ? req.file.filename : null,
    });

    successResponse(res, "New Announcement add");
  } catch (error) {
    next(error);
  }
};

const getAllAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.find();

    const baseUrl = req.protocol + "://" + req.get("host") + process.env.ANNOUNCEMENT_IMAGE;
    successResponse(res, announcement, baseUrl);
  } catch (error) {
    next(error);
  }
};

const updateAnnouncement = async (req, res, next) => {
  try {
    const { title, description, date, id } = req.body;
    const announcement = await Announcement.findById(id);
    if (!announcement) return queryErrorRelatedResponse(res, 404, "Data not found");

    if (title) announcement.title = title;
    if (description) announcement.description = description;
    if (date) announcement.date = date;

    if (req.file && req.file.filename) {
      if (announcement.image) {
        deleteFile("announcementimg/" + announcement.image);
      }
      announcement.image = req.file.filename;
    }

    await announcement.save();
    successResponse(res, "Updated Successfully");
  } catch (error) {
    next(error);
  }
};

const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return queryErrorRelatedResponse(res, 404, "Data not found");

    if (announcement.image) {
      deleteFile("announcementimg/" + announcement.image);
    }
    await Announcement.deleteOne({ _id: req.params.id });
    successResponse(res, "Delete Succssfully");
  } catch (error) {
    next(error);
  }
};

const deleteManyAnnouncement = async (req, res, next) => {
  try {
    const { ids } = req.body;
    console.log(ids);
    // const announcement = await Promise.all(
    //   ids.map(async (id) => {
    //     const announcement = await Announcement.findByIdAndDelete(id);
    //     if (announcement.image) {
    //       deleteFile("announcementimg/" + announcement.image);
    //     }
    //   })
    // );

    successResponse(res, "delete Successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addAnnouncement,
  getAllAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  deleteManyAnnouncement,
};
