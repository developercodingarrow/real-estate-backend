const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

const authController = require("../controllers/authController");

router.use(
  authController.protect,
  authController.restricTO("superAdmin", "admin")
);

router.get("/projectstats", statsController.getProjectStats);
router.get("/enquirestats", statsController.getDailyEnquiries);
router.get("/amenityStats", statsController.getAmenityStats);
router.get("/overallStats", statsController.getOverallStats);
router.get("/ProjectPublishStats", statsController.getProjectPublishStats);
module.exports = router;
