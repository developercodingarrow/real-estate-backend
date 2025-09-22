const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

const authController = require("../controllers/authController");

router.use(
  authController.protect,
  authController.restricTO("superAdmin", "admin")
);

router.post("/createNewLocation", locationController.createNewLocation);
router.delete("/deleteLocation", locationController.deleteLocation);
router.get("/allLocation", locationController.allLocation);

module.exports = router;
