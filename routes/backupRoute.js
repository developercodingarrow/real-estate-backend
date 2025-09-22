const express = require("express");
const router = express.Router();
const backupController = require("../controllers/backupController");
const upload = require("../utils/uploadMiddleware");
const authController = require("../controllers/authController");

router.get("/downloadenquireBackup", backupController.downloadEnquiresBackup);
router.post(
  "/restore-enquires",
  upload.single("backupFile"),
  backupController.restoreEnquiresBackup
);
module.exports = router;
