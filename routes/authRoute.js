const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/superAdminRegistration", authController.superAdminRegisteraion);
router.post("/superAdminlogin", authController.superAdminLogin);
router.post("/adminLogin", authController.adminLogin);
router.post("/editorLogin", authController.editorLogin);
router.post("/login-otp/:token", authController.otpLogin);

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
