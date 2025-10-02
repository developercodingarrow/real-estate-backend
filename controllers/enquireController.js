const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const catchAsync = require("../utils/catchAsync");
const Enquire = require("../models/enquireModel");
const AppError = require("../utils/appError");
const Factory = require("../utils/handlerFactory");

// 1) Create New ENQUIRE Controller
exports.createEnquiry = catchAsync(async (req, res, next) => {
  const { name, email, mobileNumber, message } = req.body;

  if (!name || !email || !mobileNumber) {
    return next(new AppError("Mandatory fields are required", 400));
  }

  const enquiry = await Enquire.create({
    name,
    email,
    mobileNumber,
    message,
    pageUrl: req.body.pageUrl,
    // Auto capture meta
    ipAddress:
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    userAgent: req.headers["user-agent"],
  });

  res.status(201).json({
    status: "success",
    message: "Enquiry submitted successfully",
    data: enquiry,
  });
});

// Get all enquiries (for admin dashboard)

exports.getAllEnquiries = Factory.getAll(Enquire);
