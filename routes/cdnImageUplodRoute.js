const express = require("express");
const router = express.Router();
const imageUploadController = require("../controllers/imageUploadController");
const {
  handleMulterErrors,
  projectImageMiddleware,
  projectGalleryMiddleware,
} = require("../utils/cdnMulterMidelwear");

router.patch(
  "/update-project-image/:_id",
  projectImageMiddleware,
  handleMulterErrors,
  imageUploadController.updateProjectImage
);

router.patch(
  "/add-gallery-image/:_id",
  projectGalleryMiddleware,
  handleMulterErrors,
  imageUploadController.updateProjectGallery
);

router.delete(
  "/delete-gallery-image/:_id",
  imageUploadController.deleteGalleryImage
);

module.exports = router;
