const express = require("express");
const router = express.Router();
const amnitiesController = require("../controllers/amnitiesController");

router.post("/createAmenity", amnitiesController.createAmenity);
router.get("/allAmnities", amnitiesController.allAmnities);

module.exports = router;
