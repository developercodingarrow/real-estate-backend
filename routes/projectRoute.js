const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

router.post("/createProject", projectController.createProject);
router.get("/allProject", projectController.allProject);
router.get("/getSingleProject/:slug", projectController.getSingleProject);
router.post(
  "/updateProjectFileds/:slug",
  projectController.updateProjectFileds
);
router.delete("/deleteProjectImage/:id", projectController.deleteProjectImage);
router.post("/addAmenities/:_id", projectController.addAmenitiesProject);
router.post("/updateProjectSeo/:slug", projectController.updateProjectSeo);
router.post("/addKeywords/:_id", projectController.addKeywords);

module.exports = router;
