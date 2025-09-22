const express = require("express");
const router = express.Router();
const builderController = require("../controllers/builderController");

const authController = require("../controllers/authController");

router.use(
  authController.protect,
  authController.restricTO("superAdmin", "admin")
);

router.post("/createBuilder", builderController.createNewBuilder);
router.get("/allBuilder", builderController.allBuilder);
router.delete("/deleteBuilder", builderController.deleteBuilder);

module.exports = router;
