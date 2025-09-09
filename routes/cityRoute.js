const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");

const authController = require("../controllers/authController");

router.use(authController.protect, authController.restricTO("superAdmin"));

router.post("/createCity", cityController.createNewCity);
router.get("/allCity", cityController.allCity);
router.delete("/deleteCity", cityController.deleteCity);

module.exports = router;
