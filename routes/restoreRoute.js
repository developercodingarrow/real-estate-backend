const express = require("express");
const router = express.Router();
const RestoreBackupController = require("../controllers/RestoreBackupController");
const upload = require("../utils/uploadMiddleware");
const authController = require("../controllers/authController");

// Restore All Enquires
router.post(
  "/restore-enquires",
  upload.single("backupFile"),
  RestoreBackupController.restoreEnquiresBackup
);

// Restore All City
router.post(
  "/restore-city-backup",
  upload.single("backupFile"),
  RestoreBackupController.restoreCitysBackup
);
// Restore All Location
router.post(
  "/restore-Location-backup",
  upload.single("backupFile"),
  RestoreBackupController.restoreLocationsBackup
);
// Restore All Builder
router.post(
  "/restore-builder-backup",
  upload.single("backupFile"),
  RestoreBackupController.restoreBuilderBackup
);
// Restore All Amenity
router.post(
  "/restore-amenity-backup",
  upload.single("backupFile"),
  RestoreBackupController.restoreAmenityBackup
);
router.post(
  "/restore-blogs-backup",
  upload.single("backupFile"),
  RestoreBackupController.restoreBlogsBackup
);

router.post(
  "/restore-teamuser-backup",
  upload.single("backupFile"),
  RestoreBackupController.restoreUserBackup
);

router.post(
  "/restore-project-backup",
  upload.single("backupFile"),
  RestoreBackupController.restorePropertyBackup
);
module.exports = router;
