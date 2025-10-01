const Enquire = require("../models/enquireModel");
const Project = require("../models/propertiesModel");
const Blog = require("../models/blogModel");
const Amenity = require("../models/amenityModel");
const City = require("../models/cityModel");
const Location = require("../models//locationModel");
const Builder = require("../models/builderModel");
const User = require("../models/userModel");

// 1) Enquire Backup download controllers
exports.downloadEnquiresBackup = async (req, res, next) => {
  try {
    const data = await Enquire.find().lean();

    const jsonData = JSON.stringify(data, null, 2); // pretty print
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const fileName = `enquires_backup_${date}.json`;

    // Set headers so browser downloads file
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    // Send JSON data directly
    res.send(jsonData);
  } catch (err) {
    next(err);
  }
};

// 2) Projects Backup for Restore (without populating amenities)
exports.downloadProjectsBackupForRestore = async (req, res, next) => {
  try {
    // Fetch all projects (NO populate, so amenities remain ObjectId strings)
    const projects = await Project.find().lean();

    // Convert to JSON string (pretty print for readability)
    const jsonData = JSON.stringify(projects, null, 2);

    // Create filename with current date
    const date = new Date().toISOString().split("T")[0];
    const fileName = `projects_backup_for_restore${date}.json`;

    // Set headers to force download
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    res.send(jsonData);
  } catch (err) {
    next(err);
  }
};

// 3) Blogs Backup download controllers
exports.downloadBlogsBackup = async (req, res, next) => {
  try {
    const data = await Blog.find().lean();
    const jsonData = JSON.stringify(data, null, 2); // pretty print
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const fileName = `blogs_backup_${date}.json`;

    // Set headers so browser downloads file
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(jsonData);
  } catch (err) {
    next(err);
  }
};
//  4) Amenities Backup download controllers
exports.downloadAmenitiesBackup = async (req, res, next) => {
  try {
    const data = await Amenity.find().lean();
    const jsonData = JSON.stringify(data, null, 2); // pretty print
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const fileName = `amenities_backup_${date}.json`;
    // Set headers so browser downloads file
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(jsonData);
  } catch (err) {
    next(err);
  }
};

// 5) Cities Backup download controllers
exports.downloadCitiesBackup = async (req, res, next) => {
  try {
    const data = await City.find().lean();
    const jsonData = JSON.stringify(data, null, 2); // pretty print
    const date = new Date().toISOString().split("T")[0];
    const fileName = `cities_backup_${date}.json`;

    // Set headers so browser downloads file
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(jsonData);
  } catch (err) {
    next(err);
  }
};

// 6) Locations Backup download controllers
exports.downloadLocationsBackup = async (req, res, next) => {
  try {
    const data = await Location.find().lean();
    const jsonData = JSON.stringify(data, null, 2); // pretty print
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const fileName = `locations_backup_${date}.json`;

    // Set headers so browser downloads file
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(jsonData);
  } catch (err) {
    next(err);
  }
};

// 7) Builders Backup download controllers
exports.downloadBuildersBackup = async (req, res, next) => {
  try {
    const data = await Builder.find().lean();
    const jsonData = JSON.stringify(data, null, 2); // pretty print
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const fileName = `builders_backup_${date}.json`;
    // Set headers so browser downloads file
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(jsonData);
  } catch (err) {
    next(err);
  }
};

// 8) Users Backup download controllers
exports.downloadUsersBackup = async (req, res, next) => {
  try {
    const data = await User.find().lean();
    const jsonData = JSON.stringify(data, null, 2); // pretty print
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const fileName = `users_backup_${date}.json`;
    // Set headers so browser downloads file
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(jsonData);
  } catch (err) {
    next(err);
  }
};

// Projects Backup download controllers
exports.downloadProjectsBackup = async (req, res, next) => {
  try {
    // Fetch all projects with amenities populated
    const projects = await Project.find()
      .populate("amenities") // will fetch full amenities details
      .lean();

    // Stringify for backup (pretty print)
    const jsonData = JSON.stringify(projects, null, 2);

    // Date-based filename
    const date = new Date().toISOString().split("T")[0];
    const fileName = `projects_backup_${date}.json`;

    // Set headers for file download
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    // Send JSON
    res.send(jsonData);
  } catch (err) {
    next(err);
  }
};
// Restore controller
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
