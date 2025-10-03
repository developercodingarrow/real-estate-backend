const express = require("express");
const router = express.Router();
const builderController = require("../controllers/builderController");

const authController = require("../controllers/authController");
const {
  sanitizeBody,
  sanitizeParams,
  sanitizeQuery,
} = require("../utils/sanitizeMiddleware");

router.use(
  authController.protect,
  authController.restricTO("superAdmin", "admin")
);

// Builder routes with sanitization
router.post("/createBuilder", sanitizeBody, builderController.createNewBuilder);

router.get("/allBuilder", sanitizeQuery, builderController.allBuilder);

router.delete("/deleteBuilder", sanitizeBody, builderController.deleteBuilder);

module.exports = router;
