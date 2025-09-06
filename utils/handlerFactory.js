const fs = require("fs");
const path = require("path");
const catchAsync = require("./catchAsync");
const AppError = require("./appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

// 1) handel factory
exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.find();
    res.status(200).json({
      total: doc.length,
      status: "success",
      data: doc,
    });
  });
};

// 2) handel factory
exports.getAllByFiled = (Model, filed, filedValue) => {
  return catchAsync(async (req, res, next) => {
    // 1) Check if the user is logged in
    // if (!req.user) {
    //   return next(
    //     new AppError("You must be logged in to access this resource.", 401)
    //   );
    // }
    // 2) Role-based validation (support for multiple roles)
    //const allowedRoles = ["superAdmin"]; // Add roles that are allowed to access this route
    // if (!allowedRoles.includes(req.user.role)) {
    //   return next(
    //     new AppError("You do not have permission to access this resource.", 403)
    //   );
    // }
    const doc = await Model.find({ [filed]: filedValue });
    res.status(200).json({
      status: "success",
      data: doc,
      total: doc.length,
    });
  });
};

// 3) GET Single Data By Param
exports.getSingleDataByParam = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findOne({ _id: req.params.slug });
    if (!doc) {
      return next(new AppError("There Is no document found", 404));
    }
    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
};

// 4) Update one by fileds
exports.updateOneByFillterdFiled = (Model, allowedFields) => {
  return catchAsync(async (req, res, next) => {
    // Filter req.body to only include allowed fields
    const filteredBody = filterObj(req.body, ...allowedFields);

    const doc = await Model.findByIdAndUpdate(
      { _id: req.params.slug },
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      return next(new AppError("No document found with this ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
      message: "Project updated successfully",
    });
  });
};

// 5) Delete Single Image
exports.deleteSingleImage = (Model, fieldName) => {
  return catchAsync(async (req, res, next) => {
    const { id } = req.params;
    // const { imageId } = req.body;

    const data = await Model.findById(id);
    if (!data) {
      return next(new AppError("There is no data", 404));
    }
    // Remove the image field from the document
    data[fieldName] = undefined;
    await data.save();

    res.status(200).json({
      status: "success",
      message: "Deleted Image succesfully",
    });
  });
};
