const mongoose = require("mongoose");
const slugify = require("slugify");

const amenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // prevent duplicate names
    trim: true,
  },
  propertyType: {
    type: String,
    enum: [
      "apartment",
      "house",
      "plot",
      "shop",
      "mall",
      "commerercial-project",
      "residential-project",
      "co-working-office-space",
      "ready-to-move-office-space",
    ],
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

// Pre-save middleware to generate slug from name
amenitySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Amenity = mongoose.model("amanities", amenitySchema);

module.exports = Amenity;
