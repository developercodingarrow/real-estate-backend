const express = require("express");
const router = express.Router();
const imageUploadController = require("../controllers/imageUploadController");
const {
  handleMulterErrors,
  projectImageMiddleware,
  projectGalleryMiddleware,
  blogImageMiddleware,
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

router.patch(
  "/update-blog-image/:_id",
  blogImageMiddleware,
  handleMulterErrors,
  imageUploadController.updateBlogImage
);

router.delete("/delete-blog-image/:_id", imageUploadController.deleteBlogImage);

module.exports = router;
