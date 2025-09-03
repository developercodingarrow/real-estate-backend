const mongoose = require("mongoose");
const slugify = require("slugify");

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // prevent duplicate names
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to generate slug from name
citySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const City = mongoose.model("cities", citySchema);

module.exports = City;
