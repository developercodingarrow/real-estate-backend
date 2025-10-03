const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const {
  sanitizeBody,
  sanitizeParams,
  sanitizeQuery,
} = require("../utils/sanitizeMiddleware");
const authController = require("../controllers/authController");

router.use(
  authController.protect,
  authController.restricTO("superAdmin", "admin")
);

// Routes with sanitization
router.post(
  "/createNewLocation",
  sanitizeBody,
  locationController.createNewLocation
);

router.delete(
  "/deleteLocation",
  sanitizeBody,
  locationController.deleteLocation
);

router.get("/allLocation", sanitizeQuery, locationController.allLocation);

module.exports = router;
