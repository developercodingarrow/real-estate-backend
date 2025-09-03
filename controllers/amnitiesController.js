const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const catchAsync = require("../utils/catchAsync");
const Amenity = require("../models/amenityModel");
const AppError = require("../utils/appError");
const Factory = require("../utils/handlerFactory");

// 1) Create New Project Controller
exports.createAmenity = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newProject = await Amenity.create(req.body);
  res.status(201).json({
    status: "success",
    data: newProject,
  });
});

// 2) Get All Project Controller
exports.allAmnities = Factory.getAll(Amenity);
