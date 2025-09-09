const express = require("express");
const router = express.Router();
const enquireController = require("../controllers/enquireController");

const authController = require("../controllers/authController");

router.use(authController.protect, authController.restricTO("superAdmin"));

router.post("/createEnquire", enquireController.createEnquiry);
router.get("/allEnquire", enquireController.getAllEnquiries);

module.exports = router;
