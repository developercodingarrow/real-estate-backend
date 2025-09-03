const multer = require("multer");

// Storage in memory
const storage = multer.memoryStorage();

// File filter for images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
  }
  cb(null, true);
};

// Multer upload instance
const imageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB limit
  },
});

// Middlewares for uploading images
exports.projectImageMiddleware = imageUpload.single("projectImage");

// ✅ Middleware for multiple gallery images
exports.projectGalleryMiddleware = imageUpload.array("galleryImages", 5);

// Multer Error Handling Middleware
exports.handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer specific errors (like file too large)
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  } else if (err) {
    // Any other error (e.g. invalid file type)
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
  next();
};
