const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

const authController = require("../controllers/authController");
const {
  sanitizeBody,
  sanitizeParams,
  sanitizeQuery,
} = require("../utils/sanitizeMiddleware");

router.use(
  authController.protect,
  authController.restricTO("superAdmin", "admin", "editor")
);

// Blog routes with sanitizers
router.post(
  "/startCreateBlog",
  sanitizeBody,
  blogController.startcreateNewBlog
);

router.post(
  "/updateBlogContnet/:id",
  sanitizeParams,
  sanitizeBody,
  blogController.updateBlogContnet
);

router.get("/getSingleBlog/:id", sanitizeParams, blogController.getBlogById);

router.post(
  "/addKeywords/:_id",
  sanitizeParams,
  sanitizeBody,
  blogController.addKeywords
);

router.post(
  "/updateSlug/:id",
  sanitizeParams,
  sanitizeBody,
  blogController.updateSlug
);

router.get("/allBlogs", sanitizeQuery, blogController.allBlogs);

router.patch("/isPublished", sanitizeBody, blogController.togglePublishStatus);

module.exports = router;
