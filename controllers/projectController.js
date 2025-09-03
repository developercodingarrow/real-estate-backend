const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const catchAsync = require("../utils/catchAsync");
const Project = require("../models/residentialprojectModel");
const AppError = require("../utils/appError");
const Factory = require("../utils/handlerFactory");

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
]);

// 4) Delete Project Image Controller
exports.deleteProjectImage = Factory.deleteSingleImage(Project, "projectImage");

// 5) Get All Project Controller
exports.allProject = Factory.getAllByFiled(
  Project,
  "propertyCategory",
  "residential"
);
// 5) Add Amenities to Project Controller
exports.addAmenitiesProject = catchAsync(async (req, res, next) => {
  const { _id } = req.params; // slug from URL
  const { amenities } = req.body; // array of amenity IDs from frontend

  if (!amenities || !Array.isArray(amenities)) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide an array of amenity IDs",
    });
  }

  // find project
  const project = await Project.findOne({ _id });
  if (!project) {
    return res.status(404).json({
      status: "fail",
      message: "Project not found",
    });
  }

  // push new amenities (avoid duplicates)
  project.amenities = [...new Set([...project.amenities, ...amenities])];

  await project.save();

  res.status(200).json({
    status: "success",
    message: "Amenities added successfully",
    data: {
      project,
    },
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
