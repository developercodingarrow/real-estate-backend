const mongoose = require("mongoose");

const enquireSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      trim: true,
    },
    // Extra Context
    pageUrl: {
      type: String,
      trim: true,
      required: [true, "Page URL is required"], // track where enquiry came from
    },
    // Meta Info
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String, // store browser/device info
    },
  },
  { timestamps: true } // createdAt + updatedAt automatically
);

// Model
const Enquire = mongoose.model("enquires", enquireSchema);

module.exports = Enquire;
