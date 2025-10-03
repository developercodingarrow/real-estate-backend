const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { sanitizeBody } = require("../utils/sanitizeMiddleware");

// Public routes → sanitize incoming body
router.post(
  "/superAdminRegistration",
  sanitizeBody,
  authController.superAdminRegisteraion
);
router.post("/superAdminlogin", sanitizeBody, authController.superAdminLogin);
router.post("/adminLogin", sanitizeBody, authController.adminLogin);
router.post("/editorLogin", sanitizeBody, authController.editorLogin);
router.post("/login-otp/:token", sanitizeBody, authController.otpLogin);

router.post(
  "/logout",
  authController.protect,
  authController.restricTO("superAdmin"),
  authController.logOut
);

router.use(
  authController.protect,
  authController.restricTO("superAdmin", "admin", "editor")
);
router.post("/createTeamMember", authController.createTeamMember);
router.get("/allTeamMember", authController.getAllTeamMember);

module.exports = router;
