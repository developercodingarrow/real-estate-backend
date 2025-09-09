const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

const authController = require("../controllers/authController");

router.use(authController.protect, authController.restricTO("superAdmin"));

router.post("/createNewLocation", locationController.createNewLocation);
router.get("/cityLocations/:_id", locationController.getCityLocation);
router.delete("/deleteLocation", locationController.deleteLocation);
router.get("/allLocation", locationController.allLocation);

module.exports = router;
