const express = require("express");
const router = express.Router();
const amnitiesController = require("../controllers/amnitiesController");
const authController = require("../controllers/authController");

router.use(
  authController.protect,
  authController.restricTO("superAdmin", "admin")
);

router.post("/createAmenity", amnitiesController.createAmenity);
router.get("/allAmnities", amnitiesController.allAmnities);
router.delete("/deleteamenities", amnitiesController.deleteAmenities);

module.exports = router;
