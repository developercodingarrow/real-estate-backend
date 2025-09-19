const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const catchAsync = require("../utils/catchAsync");
const Project = require("../models/propertiesModel");
const AppError = require("../utils/appError");
const Factory = require("../utils/handlerFactory");
const slugify = require("slugify");

// 1) Create New Project Controller
exports.createProject = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newProject = await Project.create(req.body);
  res.status(201).json({
    status: "success",
    data: newProject,
  });
});

// 2) Get Single Project Controller
exports.getSingleProject = Factory.getSingleDataByParam(Project);
// 3) Update Project Fileds Controller
exports.updateProjectFileds = Factory.updateOneByFillterdFiled(Project, [
  "projectStatus",
  "projectType",
  "builder",
  "city",
  "location",
  "address",
  "price",
  "carpetArea",
  "reraNo",
  "basicPrice",
  "possessionDate",
  "builtUpArea",
  "superBuiltUpArea",
  "slug",
  "noOfBalconies",
  "noOfBadrooms",
  "noOfBathrooms",
  "projectStatus",
  "noOfBedrooms",
  "plotOpenSide",
  "plotWidth",
  "plotLength",
  "plotArea",
  "plotPossession",
  "totalFloors",
  "propertyOnFloor",
  "rent",
  "noOfFloors",
  "noOfUnits",
  "officeCabines",
  "officeMiniSeats",
  "unitType",
  "ProjectArea",
  "StartsPrice",
]);

// 4) Delete Project Image Controller
exports.deleteProjectImage = Factory.deleteSingleImage(Project, "projectImage");

// 5) Add Amenities to Project Controller addAmenitiesProject
exports.addAmenitiesProject = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  const { amenities } = req.body; // must be full array of IDs

  if (!Array.isArray(amenities)) {
    return res.status(400).json({
      status: "fail",
      message: "Please send an array of amenity IDs (full selection).",
    });
  }

  const project = await Project.findByIdAndUpdate(
    _id,
    { amenities: amenities.map(String) }, // normalize to strings
    { new: true, runValidators: true }
  );

  if (!project) {
    return res
      .status(404)
      .json({ status: "fail", message: "Project not found" });
  }

  res.status(200).json({
    status: "success",
    message: "Amenities updated",
  });
});

exports.updateProjectSeo = Factory.updateOneByFillterdFiled(Project, [
  "title",
  "metaDescription",
  "content",
]);

exports.addKeywords = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  const { keywords } = req.body; // should be array

  console.log(keywords);

  if (!Array.isArray(keywords) || keywords.length === 0) {
    return next(new AppError("Keywords must be a non-empty array", 400));
  }

  const project = await Project.findByIdAndUpdate(
    _id,
    { $set: { keywords } }, // overwrite keywords array
    { new: true, runValidators: true }
  );

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Keywords added successfully",
    data: project,
  });
});

// 5) Get All Project Controller
exports.allProject = Factory.getAllByFiled(
  Project,
  "propertyCategory",
  "residential"
);

exports.allprojects = Factory.getAll(Project);

// controllers/projectController.js
exports.toggleFeatured = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new AppError("Project ID is required", 400));
  }

  const project = await Project.findById(id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  const updated = await Project.findByIdAndUpdate(
    id,
    { $set: { isFeatured: !project.isFeatured } }, // toggle manually
    { new: true, runValidators: false }
  );

  res.status(200).json({
    status: "success",
    message: `Project isFeatured set to ${updated.isFeatured}`,
  });
});

// controllers/projectController.js
exports.togglePublishStatus = catchAsync(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new AppError("Project ID is required", 400));
  }

  const project = await Project.findById(id);

  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  const updated = await Project.findByIdAndUpdate(
    id,
    { $set: { publishStatus: !project.publishStatus } }, // toggle
    { new: true, runValidators: false }
  );

  res.status(200).json({
    status: "success",
    message: `Project publishStatus set to ${updated.publishStatus}`,
  });
});

exports.updateSlug = catchAsync(async (req, res, next) => {
  const { _id } = req.params; // project ID from URL
  const { slug } = req.body; // text for slug from frontend

  if (!slug || slug.trim() === "") {
    return res.status(400).json({
      status: "fail",
      message: "Please provide a valid slug text",
    });
  }

  const project = await Project.findById(_id);
  if (!project) {
    return res.status(404).json({
      status: "fail",
      message: "Project not found",
    });
  }

  // Convert provided text into slug
  const newSlug = slugify(slug, { lower: true, strict: true });

  project.slug = newSlug;
  await project.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Slug updated successfully",
    data: { slug: project.slug },
  });
});
