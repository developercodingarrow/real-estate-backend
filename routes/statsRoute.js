const express = require("express");
const statsController = require("../controllers/statsController");

const router = express.Router();

router.get("/projectstats", statsController.getProjectStats);
router.get("/enquirestats", statsController.getDailyEnquiries);
router.get("/amenityStats", statsController.getAmenityStats);
router.get("/overallStats", statsController.getOverallStats);
router.get("/ProjectPublishStats", statsController.getProjectPublishStats);
module.exports = router;
