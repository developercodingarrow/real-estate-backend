const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const catchAsync = require("../utils/catchAsync");
const City = require("../models/cityModel");
const AppError = require("../utils/appError");
const Factory = require("../utils/handlerFactory");

// 1) Create New builder Controller
exports.createNewCity = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newCity = await City.create(req.body);
  res.status(201).json({
    status: "success",
    data: newCity,
    message: "City is created successfully",
  });
});

// 2) Get All builder Controller
exports.allCity = Factory.getAll(City);

// 3) DELETE Builder Controller
exports.deleteCity = catchAsync(async (req, res, next) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({
      status: "fail",
      message: "City ID is required",
    });
  }

  const city = await City.findByIdAndDelete(_id);

  if (!city) {
    return res.status(404).json({
      status: "fail",
      message: "No city found with this ID",
    });
  }

  res.status(200).json({
    status: "success",
    message: "city deleted successfully",
    data: city,
  });
});
