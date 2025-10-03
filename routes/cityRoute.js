const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");
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

router.post("/createCity", cityController.createNewCity);
router.get("/allCity", cityController.allCity);
router.delete("/deleteCity", cityController.deleteCity);

module.exports = router;
