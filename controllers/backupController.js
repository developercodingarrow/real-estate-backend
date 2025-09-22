const Enquire = require("../models/enquireModel");

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
