const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

router.post("/createNewLocation", locationController.createNewLocation);
router.get("/cityLocations/:_id", locationController.getCityLocation);
router.delete("/deleteLocation", locationController.deleteLocation);
router.get("/allLocation", locationController.allLocation);

module.exports = router;
