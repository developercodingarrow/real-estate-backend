const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const catchAsync = require("../utils/catchAsync");
const Project = require("../models/residentialprojectModel");
const Blog = require("../models/blogModel");
const AppError = require("../utils/appError");
const Factory = require("../utils/handlerFactory");

// ✅ Get all Residential Rent Properties
exports.getResidentialRentProject = catchAsync(async (req, res, next) => {
  const properties = await Project.find({
    lookingFor: "rent",
    propertyCategory: "residential",
  }).sort({ updatedAt: -1 });

  if (!properties || properties.length === 0) {
    return next(new AppError("No residential rent properties found", 404));
  }

  res.status(200).json({
    status: "success",
    results: properties.length,
    data: properties,
  });
});

// ✅ Get all Residential Buy Properties
exports.getResidentialBuyProject = catchAsync(async (req, res, next) => {
  const properties = await Project.find({
    lookingFor: "sell",
    propertyCategory: "residential",
  }).sort({ updatedAt: -1 });

  if (!properties || properties.length === 0) {
    return next(new AppError("No residential rent properties found", 404));
  }

  res.status(200).json({
    status: "success",
    results: properties.length,
    data: properties,
  });
});

// ✅ Get Residential Rent Projects by Property Type (slug)
exports.getResidentialRentProjectByType = catchAsync(async (req, res, next) => {
  const { slug } = req.params; // propertyType will come as slug from URL

  const properties = await Project.find({
    lookingFor: "rent",
    propertyCategory: "residential",
    propertyType: slug, // ✅ match by propertyType
  }).sort({ updatedAt: -1 }); // newest first

  if (!properties || properties.length === 0) {
    return next(
      new AppError(
        `No residential rent properties found for propertyType: ${slug}`,
        404
      )
    );
  }

  res.status(200).json({
    status: "success",
    results: properties.length,
    data: properties,
  });
});

// ✅ Get Residential Rent Projects by Property Type (slug)
exports.getResidentialBuyProjectByType = catchAsync(async (req, res, next) => {
  const { slug } = req.params; // propertyType will come as slug from URL

  const properties = await Project.find({
    lookingFor: "sell",
    propertyCategory: "residential",
    propertyType: slug, // ✅ match by propertyType
  }).sort({ updatedAt: -1 }); // newest first

  if (!properties || properties.length === 0) {
    return next(
      new AppError(
        `No residential rent properties found for propertyType: ${slug}`,
        404
      )
    );
  }

  res.status(200).json({
    status: "success",
    results: properties.length,
    data: properties,
  });
});

// ✅ Get Project by Slug
exports.getProjectBySlug = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const project = await Project.findOne({ slug }).populate(
    "amenities",
    "name -_id"
  );

  if (!project) {
    return next(new AppError(`No project found with slug: ${slug}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: project,
  });
});

// ✅ Get all commercial Rent Properties
exports.getCommercialRentProject = catchAsync(async (req, res, next) => {
  const properties = await Project.find({
    lookingFor: "rent",
    propertyCategory: "commercial",
  }).sort({ updatedAt: -1 });

  if (!properties || properties.length === 0) {
    return next(new AppError("No commercial rent properties found", 404));
  }

  res.status(200).json({
    status: "success",
    results: properties.length,
    data: properties,
  });
});

// ✅ Get all commercial Buy Properties
exports.getCommercialBuyProject = catchAsync(async (req, res, next) => {
  const properties = await Project.find({
    lookingFor: "sell",
    propertyCategory: "commercial",
  }).sort({ updatedAt: -1 });

  if (!properties || properties.length === 0) {
    return next(new AppError("No commercial Buy properties found", 404));
  }

  res.status(200).json({
    status: "success",
    results: properties.length,
    data: properties,
  });
});

// ✅ Get commercial Rent Projects by Property Type (slug)
exports.getCommercialRentProjectByType = catchAsync(async (req, res, next) => {
  const { slug } = req.params; // propertyType will come as slug from URL

  const properties = await Project.find({
    lookingFor: "rent",
    propertyCategory: "commercial",
    propertyType: slug, // ✅ match by propertyType
  }).sort({ updatedAt: -1 }); // newest first

  if (!properties || properties.length === 0) {
    return next(
      new AppError(
        `No commercial rent properties found for propertyType: ${slug}`,
        404
      )
    );
  }

  res.status(200).json({
    status: "success",
    results: properties.length,
    data: properties,
  });
});

// ✅ Get commercial sell Projects by Property Type (slug)
exports.getCommercialBuyProjectByType = catchAsync(async (req, res, next) => {
  const { slug } = req.params; // propertyType will come as slug from URL

  const properties = await Project.find({
    lookingFor: "sell",
    propertyCategory: "commercial",
    propertyType: slug, // ✅ match by propertyType
  }).sort({ updatedAt: -1 }); // newest first

  if (!properties || properties.length === 0) {
    return next(
      new AppError(
        `No commercial rent properties found for propertyType: ${slug}`,
        404
      )
    );
  }

  res.status(200).json({
    status: "success",
    results: properties.length,
    data: properties,
  });
});

// ✅ Get commercial sell Projects by City (slug)
exports.getCommercialBuyProjectByCity = catchAsync(async (req, res, next) => {
  const { slug } = req.params; // city slug from URL
  const regex = new RegExp(`^${slug}`, "i");
  const properties = await Project.find({
    lookingFor: "sell",
    propertyCategory: "commercial",
    city: regex, // ✅ match by city
  }).sort({ updatedAt: -1 });

  if (!properties || properties.length === 0) {
    return next(
      new AppError(`No commercial Buy properties found for city: ${slug}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    results: properties.length,
    data: properties,
  });
});

// ✅ Get commercial sell Projects by Location (slug)
exports.getCommercialBuyProjectByLocation = catchAsync(
  async (req, res, next) => {
    const { slug } = req.params; // location slug from URL
    const regex = new RegExp(`^${slug}`, "i");
    const properties = await Project.find({
      lookingFor: "sell",
      propertyCategory: "commercial",
      location: regex, // ✅ match by location
    }).sort({ updatedAt: -1 });

    if (!properties || properties.length === 0) {
      return next(
        new AppError(
          `No commercial sell properties found for location: ${slug}`,
          404
        )
      );
    }

    res.status(200).json({
      status: "success",
      results: properties.length,
      data: properties,
    });
  }
);

// ✅ Get commercial Rent Projects by City (slug)
exports.getCommercialRentProjectByCity = catchAsync(async (req, res, next) => {
  const { slug } = req.params; // city slug from URL
  const regex = new RegExp(`^${slug}`, "i");
  const properties = await Project.find({
    lookingFor: "rent",
    propertyCategory: "commercial",
    city: regex, // ✅ match by city
  }).sort({ updatedAt: -1 });

  if (!properties || properties.length === 0) {
    return next(
      new AppError(`No commercial sell properties found for city: ${slug}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    results: properties.length,
    data: properties,
  });
});

// ✅ Get commercial sell Projects by Location (slug)
exports.getCommercialRentProjectByLocation = catchAsync(
  async (req, res, next) => {
    const { slug } = req.params; // location slug from URL
    const regex = new RegExp(`^${slug}`, "i");
    const properties = await Project.find({
      lookingFor: "rent",
      propertyCategory: "commercial",
      location: regex, // ✅ match by location
    }).sort({ updatedAt: -1 });

    if (!properties || properties.length === 0) {
      return next(
        new AppError(
          `No commercial sell properties found for location: ${slug}`,
          404
        )
      );
    }

    res.status(200).json({
      status: "success",
      results: properties.length,
      data: properties,
    });
  }
);

// ✅ Get residential sell Projects by City (slug)
exports.getResidentialBuyProjectByCity = catchAsync(async (req, res, next) => {
  const { slug } = req.params; // city slug from URL

  const regex = new RegExp(`^${slug}`, "i");
  const properties = await Project.find({
    lookingFor: "sell",
    propertyCategory: "residential",
    city: regex, // ✅ match by city
  }).sort({ updatedAt: -1 });

  if (!properties || properties.length === 0) {
    return next(
      new AppError(`No commercial Buy properties found for city: ${slug}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    results: properties.length,
    data: properties,
  });
});

// ✅ Get residential sell Projects by Location (slug)
exports.getResidentialBuyProjectByLocation = catchAsync(
  async (req, res, next) => {
    const { slug } = req.params; // location slug from URL
    // Convert slug to regex (case-insensitive, starts with)
    const regex = new RegExp(`^${slug}`, "i");
    const properties = await Project.find({
      lookingFor: "sell",
      propertyCategory: "residential",
      location: regex, // ✅ match by location
    }).sort({ updatedAt: -1 });

    if (!properties || properties.length === 0) {
      return next(
        new AppError(
          `No commercial sell properties found for location: ${slug}`,
          404
        )
      );
    }

    res.status(200).json({
      status: "success",
      results: properties.length,
      data: properties,
    });
  }
);

// ✅ Get residential Rent Projects by City (slug)
exports.getResidentialRentProjectByCity = catchAsync(async (req, res, next) => {
  const { slug } = req.params; // city slug from URL

  // Convert slug to regex (case-insensitive, starts with)
  const regex = new RegExp(`^${slug}`, "i");
  const properties = await Project.find({
    lookingFor: "rent",
    propertyCategory: "residential",
    city: regex, // ✅ match by city
  }).sort({ updatedAt: -1 });

  if (!properties || properties.length === 0) {
    return next(
      new AppError(
        `No residential sell properties found for city: ${slug}`,
        404
      )
    );
  }

  res.status(200).json({
    status: "success",
    results: properties.length,
    data: properties,
  });
});

// ✅ Get residential sell Projects by Location (slug)
exports.getResidentialRentProjectByLocation = catchAsync(
  async (req, res, next) => {
    const { slug } = req.params; // location slug from URL
    // Convert slug to regex (case-insensitive, starts with)
    const regex = new RegExp(`^${slug}`, "i");
    const properties = await Project.find({
      lookingFor: "rent",
      propertyCategory: "residential",
      location: regex, // ✅ match by location
    }).sort({ updatedAt: -1 });

    if (!properties || properties.length === 0) {
      return next(
        new AppError(
          `No residential sell properties found for location: ${slug}`,
          404
        )
      );
    }

    res.status(200).json({
      status: "success",
      results: properties.length,
      data: properties,
    });
  }
);

exports.getSidebarFeaturedProject = catchAsync(async (req, res, next) => {
  const projects = await Project.find(
    { isFeatured: true }, // only featured
    "projectImage updatedAt title slug" // pick fields
  )
    .sort({ updatedAt: -1 }) // newest first
    .lean();

  // filter only projects with mandatory fields
  const filteredProjects = projects.filter(
    (p) => p.title && p.projectImage?.url
  );

  res.status(200).json({
    status: "success",
    results: filteredProjects.length,
    data: filteredProjects,
  });
});

// Blogs

exports.allBlogs = catchAsync(async (req, res, next) => {
  // fetch blogs with only required fields
  let blogs = await Blog.find(
    {},
    "title metaDescription blogImage updatedAt slug keywords"
  ).sort({ createdAt: -1 });

  // format blogs → only keep first keyword if exists
  blogs = blogs.map((blog) => {
    const blogObj = blog.toObject();
    return {
      ...blogObj,
      keywords: blogObj.keywords?.length ? [blogObj.keywords[0]] : [],
    };
  });

  res.status(200).json({
    status: "success",
    results: blogs.length,
    data: blogs,
  });
});

exports.getSingleBlog = catchAsync(async (req, res, next) => {
  const { slug } = req.params; // get slug from URL

  if (!slug) {
    return res.status(400).json({
      status: "error",
      message: "Slug is required",
    });
  }

  // Find blog by slug
  const blog = await Blog.findOne({ slug }).select(
    "title blogImage updatedAt slug keywords content" // optional: limit fields
  );

  if (!blog) {
    return res.status(404).json({
      status: "error",
      message: "Blog not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: blog,
  });
});

/*
propertyCategory= residential 
propertyType="apartment", 
lookingFor="sell" 
projectStatus="upcoming" 
isFeatured = true
publishStatus= true 
only 4 and uploadedAt on first
*/

// Controller: Get Upcoming Apartment Projects
exports.getupcomingApprtmentProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find({
    propertyCategory: "residential",
    propertyType: "apartment",
    lookingFor: "sell",
    projectStatus: "upcoming",
    isFeatured: true,
    publishStatus: true,
  })
    .select(
      "title projectType projectImage slug city location , unitType reraNo"
    ) // ✅ only required fields
    .sort({ updatedAt: -1 }) // latest first
    .limit(4); // only 4 projects

  res.status(200).json({
    status: "success",
    results: projects.length,
    data: projects,
  });
});
// Controller: Get Upcoming Apartment Projects
exports.getUnderconstructionApprtmentProjects = catchAsync(
  async (req, res, next) => {
    const projects = await Project.find({
      propertyCategory: "residential",
      propertyType: "apartment",
      lookingFor: "sell",
      projectStatus: "under-construction",
      isFeatured: true,
      publishStatus: true,
    })
      .select(
        "title projectType projectImage slug city location unitType reraNo"
      ) // ✅ only required fields
      .sort({ updatedAt: -1 }) // latest first
      .limit(4); // only 4 projects

    res.status(200).json({
      status: "success",
      results: projects.length,
      data: projects,
    });
  }
);

exports.getallFeaturedProjectLinks = catchAsync(async (req, res, next) => {
  const projects = await Project.find({
    isFeatured: true,
    publishStatus: true,
    title: { $exists: true, $ne: "" }, // ✅ exclude docs with no title
  })
    .select("title slug")
    .sort({ updatedAt: -1 });
  res.status(200).json({
    status: "success",
    results: projects.length,
    data: projects,
  });
});
