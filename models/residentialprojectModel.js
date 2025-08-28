const mongoose = require("mongoose");
const slugify = require("slugify");

const residentialProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project Title is mandatory!"],
      lowercase: true,
      minlength: [3, "Project Title must be at least 3 characters long"],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    propertyCategory: {
      type: String,
      enum: ["residential", "commercial", "industrial", "land"],
      default: "residential",
      required: [true, "Property Category is mandatory!"],
    },
    propertyType: {
      type: String,
      enum: ["apartment", "independent-house", "villa", "studio-apartment"],
      default: "apartment",
    },
    lookingFor: {
      type: String,
      enum: ["buy", "rent"],
      default: "buy",
      required: [true, "Looking for is mandatory!"],
    },
    projectStatus: {
      type: String,
      enum: ["ready-to-move", "under-construction", "upcoming"],
      default: "ready-to-move",
      required: [true, "Project Status is mandatory!"],
    },
    projectType: {
      type: String,
      enum: ["affordable", "luxury"],
      default: "affordable",
      required: [true, "Project Type is mandatory!"],
    },
    builder: {
      type: String,
      lowercase: true,
      required: [true, "Builder Name is mandatory!"],
      minlength: [3, "Builder Name must be at least 3 characters long"],
    },
    city: {
      type: String,
      lowercase: true,
      required: [true, "City Name is mandatory!"],
      minlength: [3, "City Name must be at least 3 characters long"],
    },
    location: {
      type: String,
      lowercase: true,
      required: [true, "Location Name is mandatory!"],
      minlength: [3, "Location Name must be at least 3 characters long"],
    },
    address: {
      type: String,
      lowercase: true,
    },
    builtUpArea: {
      type: Number,
      required: [true, "Built-up Area is mandatory!"],
      min: [100, "Built-up Area must be at least 100 sqft"],
    },
    carpetArea: {
      type: Number,
      required: [true, "Carpet Area is mandatory!"],
      min: [100, "Carpet Area must be at least 100 sqft"],
    },
    superBuiltUpArea: {
      type: Number,
      required: [true, "Super Built-up Area is mandatory!"],
      min: [100, "Super Built-up Area must be at least 100 sqft"],
    },
    noOfFloors: {
      type: Number,
      required: [true, "No of Floors is mandatory!"],
      min: [1, "Must have at least 1 floor"],
    },
    noOfUnits: {
      type: Number,
      required: [true, "No of Units is mandatory!"],
      min: [1, "Must have at least 1 unit"],
    },
    unitType: {
      type: String,
      enum: ["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "4+BHK"],
      default: "2BHK",
      required: [true, "Unit Type is mandatory!"],
    },
    reraNo: {
      type: String,
      required: [true, "RERA No is mandatory!"],
      unique: true,
    },
    basicPrice: {
      type: Number,
      required: [true, "Basic Price is mandatory!"],
      min: [1000, "Basic Price must be at least 1000"],
    },
    possessionDate: {
      type: Date,
      required: [true, "Possession Date is mandatory!"],
      min: [Date.now(), "Possession Date must be in the future"],
    },
  },
  { timestamps: true }
);

// Slug middleware
residentialProjectSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// lowercase specific fields before saving
residentialProjectSchema.pre("save", function (next) {
  const fieldsToLower = ["title", "city", "location", "builder"];

  fieldsToLower.forEach((field) => {
    if (this[field]) {
      this[field] = this[field].toLowerCase();
    }
  });

  next();
});

const ResidentialProject = mongoose.model(
  "ResidentialProject",
  residentialProjectSchema
);

module.exports = ResidentialProject;
