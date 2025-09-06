const mongoose = require("mongoose");
const slugify = require("slugify");

const residentialProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      lowercase: true,
      minlength: [3, "Project Title must be at least 3 characters long"],
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

    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    propertyCategory: {
      type: String,
      enum: ["residential", "commercial"],
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
      default: "apartment",
    },
    lookingFor: {
      type: String,
      enum: ["sell", "rent"],
    },
    projectStatus: {
      type: String,
      enum: ["ready-to-move", "under-construction", "upcoming"],
      default: "ready-to-move",
    },
    projectType: {
      type: String,
      enum: ["affordable", "luxury"],
      default: "affordable",
    },
    builder: {
      type: String,
      lowercase: true,
      minlength: [3, "Builder Name must be at least 3 characters long"],
    },
    city: {
      type: String,
      lowercase: true,
      minlength: [3, "City Name must be at least 3 characters long"],
    },
    location: {
      type: String,
      lowercase: true,
      minlength: [3, "Location Name must be at least 3 characters long"],
    },
    address: {
      type: String,
      lowercase: true,
    },
    builtUpArea: {
      type: Number,
      min: [100, "Built-up Area must be at least 100 sqft"],
    },
    carpetArea: {
      type: Number,
      min: [100, "Carpet Area must be at least 100 sqft"],
    },
    superBuiltUpArea: {
      type: Number,
      min: [100, "Super Built-up Area must be at least 100 sqft"],
    },
    noOfFloors: {
      type: Number,
      min: [1, "Must have at least 1 floor"],
    },
    noOfUnits: {
      type: Number,
      min: [1, "Must have at least 1 unit"],
    },
    unitType: {
      type: String,
      enum: ["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "4+BHK"],
      default: "2BHK",
    },
    reraNo: {
      type: String,
    },
    basicPrice: {
      type: Number,
      min: [1000, "Basic Price must be at least 1000"],
    },
    possessionDate: {
      type: Date,
      min: [Date.now(), "Possession Date must be in the future"],
    },
    projectImage: {
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
    galleryImages: [
      {
        url: {
          type: String,
          required: true,
        },
        altText: {
          type: String,
          default: "",
        },
        title: {
          type: String,
          default: "",
        },
        caption: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    amenities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenity",
      },
    ],
    noOfBathrooms: {
      type: Number,
    },
    noOfBedrooms: {
      type: Number,
    },
    noOfBalconies: {
      type: Number,
    },
    plotArea: {
      type: Number,
      min: [100, "Plot Area must be at least 100 sqft"],
    },

    plotLength: {
      type: Number,
      min: [100, "Plot Length must be at least 100 sqft"],
    },
    plotWidth: {
      type: Number,
      min: [100, "Plot Length must be at least 100 sqft"],
    },
    plotOpenSide: {
      type: Number,
    },

    plotPossession: {
      type: String,
      lowercase: true,
    },
    totalFloors: {
      type: Number,
    },
    propertyOnFloor: {
      type: String,
      lowercase: true,
    },

    officeMiniSeats: {
      type: Number,
    },
    officeCabines: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Slug middleware
residentialProjectSchema.pre("save", function (next) {
  // Only run if slug is empty or title is modified
  if (!this.slug || this.isModified("title")) {
    let baseSlug = "";

    if (this.title) {
      // If title exists, slugify title
      baseSlug = slugify(this.title, { lower: true, strict: true });
    } else {
      // Fallback slug: lookingFor-propertyCategory-propertyType
      baseSlug = `${this.lookingFor || "sell"}-${
        this.propertyCategory || "residential"
      }-${this.propertyType || "apartment"}`;
      baseSlug = slugify(baseSlug, { lower: true, strict: true });
    }

    // Unique suffix with timestamp
    const uniqueSuffix = Date.now();
    this.slug = `${baseSlug}-${uniqueSuffix}`;
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
