const express = require("express");
const router = express.Router();
const backupController = require("../controllers/backupController");
const authController = require("../controllers/authController");

router.use(authController.protect, authController.restricTO("superAdmin"));
// 1) Enquire Backup download Routes
router.get("/downloadenquireBackup", backupController.downloadEnquiresBackup);

// 2) Projects Backup for Restore (without populating amenities)
router.get(
  "/downloadProjectsBackupForRestore",
  backupController.downloadProjectsBackupForRestore
);
// 3) Blogs Backup download Routes
router.get("/downloadBlogsBackup", backupController.downloadBlogsBackup);
// 4) Users Backup download Routes
router.get("/downloadUsersBackup", backupController.downloadUsersBackup);
// 5) Amenities Backup download Routes
router.get(
  "/downloadAmenitiesBackup",
  backupController.downloadAmenitiesBackup
);
// 6) Cities Backup download Routes
router.get("/downloadCitiesBackup", backupController.downloadCitiesBackup);
// 7) Locations Backup download Routes
router.get(
  "/downloadLocationsBackup",
  backupController.downloadLocationsBackup
);
// 8) Builders Backup download Routes
router.get("/downloadBuildersBackup", backupController.downloadBuildersBackup);
// 9) Projects Backup download Routes
router.get("/downloadProjectsBackup", backupController.downloadProjectsBackup);
// Restore Part

module.exports = router;
