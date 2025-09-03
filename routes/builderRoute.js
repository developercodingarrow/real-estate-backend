const express = require("express");
const router = express.Router();
const builderController = require("../controllers/builderController");

router.post("/createBuilder", builderController.createNewBuilder);
router.get("/allBuilder", builderController.allBuilder);
router.delete("/deleteBuilder", builderController.deleteBuilder);

module.exports = router;
