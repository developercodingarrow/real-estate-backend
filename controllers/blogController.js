const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const catchAsync = require("../utils/catchAsync");
const Blog = require("../models/blogModel");
const AppError = require("../utils/appError");
const Factory = require("../utils/handlerFactory");
const slugify = require("slugify");

exports.startcreateNewBlog = catchAsync(async (req, res, next) => {
  let { title } = req.body;

  // If no title, fallback
  if (!title || title.trim() === "") {
    title = `Untitled Blog ${new Date().toLocaleString()}`;
  }

  const blogData = {
    ...req.body,
    title,
  };

  const newBlog = await Blog.create(blogData);

  res.status(201).json({
    status: "success",
    data: newBlog,
    message: "Created new blog successfully",
  });
});

exports.updateBlogContnet = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let { title, metaDescription, content } = req.body;

  // find blog first
  let blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({
      status: "fail",
      message: "Blog not found",
    });
  }

  // update fields
  if (title && title.trim() !== "") {
    blog.title = title;
    blog.slug =
      slugify(title, { lower: true, strict: true }) + "-" + Date.now();
  }
  if (metaDescription && metaDescription.trim() !== "") {
    blog.metaDescription = metaDescription;
  }
  if (content && content.trim() !== "") {
    blog.content = content;
  }

  await blog.save();

  res.status(200).json({
    status: "success",
    data: blog,
    message: "Blog updated successfully",
  });
});

exports.getBlogById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(404).json({
      status: "fail",
      message: "Blog not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: blog,
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "fail",
      message: "Blog id is required",
    });
  }

  const blog = await Blog.findByIdAndDelete(id);

  if (!blog) {
    return res.status(404).json({
      status: "fail",
      message: "Blog not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Blog deleted successfully",
  });
});

exports.addKeywords = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  const { keywords } = req.body; // should be array

  console.log(keywords);

  if (!Array.isArray(keywords) || keywords.length === 0) {
    return next(new AppError("Keywords must be a non-empty array", 400));
  }

  const blog = await Blog.findByIdAndUpdate(
    _id,
    { $set: { keywords } }, // overwrite keywords array
    { new: true, runValidators: true }
  );

  if (!blog) {
    return next(new AppError("Project not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Keywords added successfully",
    data: blog,
  });
});

exports.updateSlug = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { slug } = req.body;

  if (!slug || slug.trim() === "") {
    return next(new AppError("Slug is required to update", 400));
  }

  // format user-provided slug
  const formattedSlug = slugify(slug, { lower: true, strict: true });

  // update only slug
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { slug: formattedSlug },
    { new: true, runValidators: true }
  );

  if (!updatedBlog) {
    return next(new AppError("Blog not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedBlog,
    message: "Slug updated successfully",
  });
});
