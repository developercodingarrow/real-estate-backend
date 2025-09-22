// middlewares/uploadMiddleware.js
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(), // keep file in memory
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/json") {
      cb(null, true);
    } else {
      cb(new Error("Only JSON files are allowed"), false);
    }
  },
});

module.exports = upload;
