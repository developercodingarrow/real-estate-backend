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
    message: "Amnities is created successfully",
  });
});

// 2) Get All Project Controller
exports.allAmnities = Factory.getAll(Amenity);

// 3) DELETE AMNITIE Controller
exports.deleteAmenities = catchAsync(async (req, res, next) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({
      status: "fail",
      message: "Amnitie ID is required",
    });
  }

  const amnite = await Amenity.findByIdAndDelete(_id);

  if (!amnite) {
    return res.status(404).json({
      status: "fail",
      message: "No Amnite found with this ID",
    });
  }

  res.status(200).json({
    status: "success",
    message: "city deleted successfully",
    data: amnite,
  });
});
