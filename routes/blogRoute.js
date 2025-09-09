const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

const authController = require("../controllers/authController");

router.use(authController.protect, authController.restricTO("superAdmin"));

router.post("/startCreateBlog", blogController.startcreateNewBlog);
router.post("/updateBlogContnet/:id", blogController.updateBlogContnet);
router.get("/getSingleBlog/:id", blogController.getBlogById);
router.post("/addKeywords/:_id", blogController.addKeywords);
router.post("/updateSlug/:id", blogController.updateSlug);
router.get("/allBlogs", blogController.allBlogs);

module.exports = router;
