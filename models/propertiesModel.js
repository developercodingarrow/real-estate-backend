const mongoose = require("mongoose");
const slugify = require("slugify");

const propertiesSchema = new mongoose.Schema(
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
      minlength: [100, "Content must be at least 100 characters long"],
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
      required: [true, "Property category is required"],
    },
    propertyType: {
      type: String,
      enum: [
        "apartment",
        "house",
        "plot",
        "shop",
        "mall",
        "farmhouse",
        "independent",
        "villa",
        "commerercial-project",
        "residential-project",
        "co-working-office-space",
        "ready-to-move-office-space",
      ],
      required: [true, "Property propertyType is required"],
    },
    lookingFor: {
      type: String,
      enum: ["sell", "rent", "buy"],
      required: [true, "Property lookingFor is required"],
    },
    projectStatus: {
      type: String,
      enum: ["ready-to-move", "under-construction", "upcoming"],
    },
    projectType: {
      type: String,
      enum: ["affordable", "luxury"],
    },
    builder: {
      type: String,
      lowercase: true,
      minlength: [3, "Builder Name must be at least 3 characters long"],
    },
    city: {
      type: String,
      lowercase: true,
    },
    location: {
      type: String,
      lowercase: true,
    },
    address: {
      type: String,
      lowercase: true,
    },
    builtUpArea: {
      type: Number,
      min: [10, "Built-up Area must be at least 100 sqft"],
    },
    carpetArea: {
      type: Number,
      min: [10, "Carpet Area must be at least 100 sqft"],
    },
    superBuiltUpArea: {
      type: Number,
      min: [10, "Super Built-up Area must be at least 100 sqft"],
    },
    noOfFloors: {
      type: Number,
    },
    noOfUnits: {
      type: Number,
    },
    unitType: {
      type: String,
    },
    reraNo: {
      type: String,
      default: "N/A",
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
    rent: {
      type: Number,
    },
    publishStatus: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
    ProjectArea: {
      type: String,
    },
    StartsPrice: {
      type: String,
    },
  },
  { timestamps: true }
);

// Slug middleware
propertiesSchema.pre("save", function (next) {
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
propertiesSchema.pre("save", function (next) {
  const fieldsToLower = ["title", "city", "location", "builder"];

  fieldsToLower.forEach((field) => {
    if (this[field]) {
      this[field] = this[field].toLowerCase();
    }
  });

  next();
});

const Properties = mongoose.model("properties", propertiesSchema);

module.exports = Properties;
