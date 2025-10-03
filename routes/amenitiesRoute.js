const express = require("express");
const router = express.Router();
const amnitiesController = require("../controllers/amnitiesController");
const authController = require("../controllers/authController");
const { sanitizeBody } = require("../utils/sanitizeMiddleware");

router.use(
  authController.protect,
  authController.restricTO("superAdmin", "admin")
);

// Apply sanitizer middleware before controller
router.post("/createAmenity", sanitizeBody, amnitiesController.createAmenity);
router.get("/allAmnities", amnitiesController.allAmnities);
router.delete("/deleteamenities", amnitiesController.deleteAmenities);

module.exports = router;
