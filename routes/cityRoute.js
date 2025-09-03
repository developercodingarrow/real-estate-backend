const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");

router.post("/createCity", cityController.createNewCity);
router.get("/allCity", cityController.allCity);
router.delete("/deleteCity", cityController.deleteCity);

module.exports = router;
