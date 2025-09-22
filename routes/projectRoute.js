const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

const authController = require("../controllers/authController");

router.use(
  authController.protect,
  authController.restricTO("superAdmin", "admin")
);

router.post("/createProject", projectController.createProject);
router.get("/allProject", projectController.allprojects);
router.get("/getSingleProject/:slug", projectController.getSingleProject);
router.post(
  "/updateProjectFileds/:slug",
  projectController.updateProjectFileds
);
router.delete("/deleteProjectImage/:id", projectController.deleteProjectImage);
router.post("/addAmenities/:_id", projectController.addAmenitiesProject);
router.post("/updateProjectSeo/:slug", projectController.updateProjectSeo);
router.post("/addKeywords/:_id", projectController.addKeywords);
router.patch("/isfeatured", projectController.toggleFeatured);
router.patch("/isPublished", projectController.togglePublishStatus);
router.post("/updateslug/:_id", projectController.updateSlug);

module.exports = router;
