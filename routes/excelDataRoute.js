const express = require("express");
const router = express.Router();
const excelDataController = require("../controllers/excelDataController");

const authController = require("../controllers/authController");
// router.use(authController.protect, authController.restricTO("superAdmin"));

router.get("/export-enquire", excelDataController.exportEnquiresToExcel);

module.exports = router;
