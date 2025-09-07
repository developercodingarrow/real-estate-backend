const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/superAdminRegistration", authController.superAdminRegisteraion);
router.post("/superAdminlogin", authController.superAdminLogin);
router.post("/login-otp/:token", authController.otpLogin);
router.post("/logout", authController.logOut);

module.exports = router;
