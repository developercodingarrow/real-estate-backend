const Enquire = require("../models/enquireModel");
const Project = require("../models/propertiesModel");
const Blog = require("../models/blogModel");
const Amenity = require("../models/amenityModel");
const City = require("../models/cityModel");
const Location = require("../models//locationModel");
const Builder = require("../models/builderModel");
const User = require("../models/userModel");

// 1) Restore Enquire backup
exports.restoreEnquiresBackup = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Backup file is required" });
    }

    // Parse uploaded JSON
    const data = JSON.parse(req.file.buffer.toString("utf8"));

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid backup format" });
    }

    // Prepare bulk operations for upsert
    const bulkOps = data.map((doc) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: doc },
        upsert: true, // insert if not exist
      },
    }));

    if (bulkOps.length > 0) {
      await Enquire.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Backup restored successfully" });
  } catch (err) {
    next(err);
  }
};

// 2) Restore city backup
exports.restoreCitysBackup = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Backup file is required" });
    }

    // Parse uploaded JSON
    const data = JSON.parse(req.file.buffer.toString("utf8"));

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid backup format" });
    }

    // Prepare bulk operations for upsert
    const bulkOps = data.map((doc) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: doc },
        upsert: true, // insert if not exist
      },
    }));

    if (bulkOps.length > 0) {
      await City.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Backup restored successfully" });
  } catch (err) {
    next(err);
  }
};

// 3) Restore Location backup
exports.restoreLocationsBackup = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Backup file is required" });
    }

    // Parse uploaded JSON
    const data = JSON.parse(req.file.buffer.toString("utf8"));

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid backup format" });
    }

    // Prepare bulk operations for upsert
    const bulkOps = data.map((doc) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: doc },
        upsert: true, // insert if not exist
      },
    }));

    if (bulkOps.length > 0) {
      await Location.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Backup restored successfully" });
  } catch (err) {
    next(err);
  }
};

// 4) Restore Builder backup
exports.restoreBuilderBackup = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Backup file is required" });
    }

    // Parse uploaded JSON
    const data = JSON.parse(req.file.buffer.toString("utf8"));

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid backup format" });
    }

    // Prepare bulk operations for upsert
    const bulkOps = data.map((doc) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: doc },
        upsert: true, // insert if not exist
      },
    }));

    if (bulkOps.length > 0) {
      await Builder.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Backup restored successfully" });
  } catch (err) {
    next(err);
  }
};

// 5) Restore Amnities backup
exports.restoreAmenityBackup = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Backup file is required" });
    }

    // Parse uploaded JSON
    const data = JSON.parse(req.file.buffer.toString("utf8"));

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid backup format" });
    }

    // Prepare bulk operations for upsert
    const bulkOps = data.map((doc) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: doc },
        upsert: true, // insert if not exist
      },
    }));

    if (bulkOps.length > 0) {
      await Amenity.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Backup restored successfully" });
  } catch (err) {
    next(err);
  }
};

// 6) Restore Blog backup
exports.restoreBlogsBackup = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Backup file is required" });
    }

    // Parse uploaded JSON
    const data = JSON.parse(req.file.buffer.toString("utf8"));

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid backup format" });
    }

    // Prepare bulk operations for upsert
    const bulkOps = data.map((doc) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: doc },
        upsert: true, // insert if not exist
      },
    }));

    if (bulkOps.length > 0) {
      await Blog.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Backup restored successfully" });
  } catch (err) {
    next(err);
  }
};

// 7) Restore User backup
exports.restoreUserBackup = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Backup file is required" });
    }

    // Parse uploaded JSON
    const data = JSON.parse(req.file.buffer.toString("utf8"));

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid backup format" });
    }

    // Prepare bulk operations for upsert
    const bulkOps = data.map((doc) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: doc },
        upsert: true, // insert if not exist
      },
    }));

    if (bulkOps.length > 0) {
      await User.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Backup restored successfully" });
  } catch (err) {
    next(err);
  }
};

// 8) Restore User backup
exports.restorePropertyBackup = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Backup file is required" });
    }

    // Parse uploaded JSON
    const data = JSON.parse(req.file.buffer.toString("utf8"));

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid backup format" });
    }

    // Prepare bulk operations for upsert
    const bulkOps = data.map((doc) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: doc },
        upsert: true, // insert if not exist
      },
    }));

    if (bulkOps.length > 0) {
      await Project.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Backup restored successfully" });
  } catch (err) {
    next(err);
  }
};
