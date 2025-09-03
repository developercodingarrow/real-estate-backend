const mongoose = require("mongoose");
const slugify = require("slugify");

const builderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Builder name is required"],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to generate slug before saving
builderSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

const Builder = mongoose.model("builders", builderSchema);

module.exports = Builder;
