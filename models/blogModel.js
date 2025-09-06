const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema({
  title: {
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

  metaDescription: {
    type: String,
    minlength: [20, "Meta Description must be at least 20 characters long"],
    maxlength: [200, "Meta Description can be at most 200 characters long"],
  },

  content: {
    type: String,
    minlength: [10, "Content must be at least 100 characters long"],
  },

  keywords: {
    type: [String], // array of strings
  },
  blogImage: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    url: {
      type: String,
      // default: "project-dummy-image.jpg",
    },
    altText: {
      type: String,
    },
    title: {
      type: String,
    },
    caption: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware to generate slug from name
blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Blog = mongoose.model("blogs", blogSchema);

module.exports = Blog;
