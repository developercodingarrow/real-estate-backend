const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const catchAsync = require("../utils/catchAsync");
const Location = require("../models/locationModel");
const AppError = require("../utils/appError");
const Factory = require("../utils/handlerFactory");

// 1) Create New Location Controller
exports.createNewLocation = catchAsync(async (req, res, next) => {
  const newLocation = await Location.create(req.body);
  res.status(201).json({
    status: "success",
    data: newLocation,
    message: "location is created successfully",
  });
});

// 3) DELETE Builder Controller
exports.deleteLocation = catchAsync(async (req, res, next) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({
      status: "fail",
      message: "Location ID is required",
    });
  }

  const location = await Location.findByIdAndDelete(_id);

  if (!location) {
    return res.status(404).json({
      status: "fail",
      message: "No Location found with this ID",
    });
  }

  res.status(200).json({
    status: "success",
    message: "location deleted successfully",
    data: location,
  });
});

// 4) Get All builder Controller
exports.allLocation = Factory.getAll(Location);
