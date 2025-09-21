const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const catchAsync = require("../utils/catchAsync");
const Builder = require("../models/builderModel");
const AppError = require("../utils/appError");
const Factory = require("../utils/handlerFactory");

// 1) Create New builder Controller
exports.createNewBuilder = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newBuilder = await Builder.create(req.body);
  res.status(201).json({
    status: "success",
    data: newBuilder,
    message: "Builder is created successfully",
  });
});

// 2) Get All builder Controller
exports.allBuilder = Factory.getAll(Builder);

// 3) DELETE Builder Controller
exports.deleteBuilder = catchAsync(async (req, res, next) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({
      status: "fail",
      message: "Builder ID is required",
    });
  }

  const builder = await Builder.findByIdAndDelete(_id);

  if (!builder) {
    return res.status(404).json({
      status: "fail",
      message: "No builder found with this ID",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Builder deleted successfully",
    data: builder,
  });
});
