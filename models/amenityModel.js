const mongoose = require("mongoose");
const slugify = require("slugify");

const amenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  propertyType: {
    type: String,
    required: true,
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

// Pre-save middleware to generate slug from name + propertyType
amenitySchema.pre("save", function (next) {
  if (this.isModified("name") || this.isModified("propertyType")) {
    this.slug = slugify(`${this.name}-${this.propertyType}`, {
      lower: true,
      strict: true,
    });
  }
  next();
});

const Amenity = mongoose.model("Amenity", amenitySchema);

module.exports = Amenity;
