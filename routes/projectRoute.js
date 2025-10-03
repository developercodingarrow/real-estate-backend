const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
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

// Project routes with sanitizers
router.post("/createProject", sanitizeBody, projectController.createProject);

router.get("/allProject", sanitizeQuery, projectController.allprojects);

router.get(
  "/getSingleProject/:slug",
  sanitizeParams,
  projectController.getSingleProject
);

router.post(
  "/updateProjectFileds/:slug",
  sanitizeParams,
  sanitizeBody,
  projectController.updateProjectFileds
);

router.delete(
  "/deleteProjectImage/:id",
  sanitizeParams,
  sanitizeBody,
  projectController.deleteProjectImage
);

router.post(
  "/addAmenities/:_id",
  sanitizeParams,
  sanitizeBody,
  projectController.addAmenitiesProject
);

router.post(
  "/updateProjectSeo/:slug",
  sanitizeParams,
  sanitizeBody,
  projectController.updateProjectSeo
);

router.post(
  "/addKeywords/:_id",
  sanitizeParams,
  sanitizeBody,
  projectController.addKeywords
);

router.patch("/isfeatured", sanitizeBody, projectController.toggleFeatured);

router.patch(
  "/isPublished",
  sanitizeBody,
  projectController.togglePublishStatus
);

router.post(
  "/updateslug/:_id",
  sanitizeParams,
  sanitizeBody,
  projectController.updateSlug
);

module.exports = router;
