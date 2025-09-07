const express = require("express");
const router = express.Router();
const enquireController = require("../controllers/enquireController");

router.post("/createEnquire", enquireController.createEnquiry);
router.get("/allEnquire", enquireController.getAllEnquiries);

module.exports = router;
