const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Factory = require("../utils/handlerFactory");
const Project = require("../models/residentialprojectModel");
const Enquire = require("../models/enquireModel");
const Amenity = require("../models/amenityModel");
const Blog = require("../models/blogModel");
const Builder = require("../models/builderModel");
const City = require("../models/cityModel");
// 📊 Aggregate stats by propertyType, propertyCategory, publishStatus
exports.getProjectStats = catchAsync(async (req, res, next) => {
  // Aggregate by propertyType
  const byType = await Project.aggregate([
    {
      $group: {
        _id: "$propertyType",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // Aggregate by propertyCategory
  const byCategory = await Project.aggregate([
    {
      $group: {
        _id: "$propertyCategory",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // Aggregate by publishStatus
  const byPublishStatus = await Project.aggregate([
    {
      $group: {
        _id: "$publishStatus",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      byType,
      byCategory,
      byPublishStatus,
    },
  });
});

exports.getDailyEnquiries = catchAsync(async (req, res, next) => {
  const dailyStats = await Enquire.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }, // group by date (YYYY-MM-DD)
        },
        enquiries: { $sum: 1 }, // count per day
      },
    },
    { $sort: { _id: 1 } }, // ascending by date
  ]);

  // Format result for frontend (Recharts expects {date, enquiries})
  const formatted = dailyStats.map((d) => ({
    date: d._id,
    enquiries: d.enquiries,
  }));

  res.status(200).json({
    status: "success",
    data: formatted,
  });
});

exports.getAmenityStats = async (req, res, next) => {
  try {
    const stats = await Amenity.aggregate([
      {
        $group: {
          _id: "$propertyType",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      status: "success",
      total: stats.length,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getOverallStats = async (req, res, next) => {
  try {
    // Run all count queries in parallel for speed
    const [
      totalProjects,
      totalBlogs,
      totalEnquires,
      totalBuilders,
      totalAmenities,
      totalCities,
    ] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      Enquire.countDocuments(),
      Builder.countDocuments(),
      Amenity.countDocuments(),
      City.countDocuments(),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalProjects,
        totalBlogs,
        totalEnquires,
        totalBuilders,
        totalAmenities,
        totalCities,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "fail",
      message: "Error fetching stats",
    });
  }
};

exports.getProjectPublishStats = catchAsync(async (req, res, next) => {
  try {
    const stats = await Project.aggregate([
      {
        $group: {
          _id: "$publishStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: stats, // directly send aggregation result
    });
  } catch (error) {
    return next(new AppError("Failed to fetch project stats", 500));
  }
});
