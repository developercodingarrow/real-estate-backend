const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../config.env") });
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Project = require("../models/propertiesModel");
const Blog = require("../models/blogModel");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const Factory = require("../utils/handlerFactory");

const s3_ImageUploder = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.SR_BUCKET_S3_API}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.SR_R2_ACCESS_KEY,
    secretAccessKey: process.env.SR_R2_SECRET_KEY,
  },
  forcePathStyle: true,
});

exports.updateProjectImage = catchAsync(async (req, res, next) => {
  try {
    console.log("File received:", req.file.originalname.split(".")[0]);

    // 2. Upload to R2
    const fileExtension = req.file.originalname.split(".").pop();
    const fileName = `saranshrealtors-project-image/${Date.now()}.${fileExtension}`;
    const imageName = req.file.originalname.split(".")[0];

    await s3_ImageUploder.send(
      new PutObjectCommand({
        Bucket: process.env.SR_BUCKET_S3_PROJECT_IMAGE,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    // 3. Update Database
    const updatedProject = await Project.findByIdAndUpdate(
      req.params._id,
      {
        projectImage: {
          url: `${process.env.SR_PROJECT_IMAGE_BUCKET_PUBLIC_URL}/${fileName}`,
          altText: imageName,
          title: `saranshrealtors-${imageName}`,
          caption: `${imageName}`,
          description: `This image is related to ${imageName} Real Estate Project`,
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      data: updatedProject,
      message: "project image upload succesfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return next(
      new AppError(
        "Failed to process and upload the image. Please try again.",
        500
      )
    );
  }
});

exports.updateProjectGallery = catchAsync(async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new AppError("No images provided for gallery update", 400));
    }

    // Upload all files to Cloudflare R2
    const galleryImages = await Promise.all(
      req.files.map(async (file) => {
        const fileExtension = file.originalname.split(".").pop();
        const imageName = file.originalname.split(".")[0];
        const fileName = `saranshrealtors-project-gallery/${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}.${fileExtension}`;

        await s3_ImageUploder.send(
          new PutObjectCommand({
            Bucket: process.env.SR_BUCKET_S3_PROJECT_IMAGE,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
        );

        return {
          url: `${process.env.SR_PROJECT_IMAGE_BUCKET_PUBLIC_URL}/${fileName}`,
          altText: imageName,
          title: `saranshrealtors-${imageName}`,
          caption: `${imageName}`,
          description: `This image is related to ${imageName} Real Estate Project`,
        };
      })
    );

    // Push new gallery images into the project
    const updatedProject = await Project.findByIdAndUpdate(
      req.params._id,
      {
        $push: { galleryImages: { $each: galleryImages } },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      data: updatedProject,
      message: "Gallery image deleted successfully",
    });
  } catch (error) {
    console.error("Error updating gallery:", error);
    return next(
      new AppError(
        "Failed to process and upload gallery images. Please try again.",
        500
      )
    );
  }
});

// 🔥 Delete gallery image
exports.deleteGalleryImage = catchAsync(async (req, res, next) => {
  const { _id } = req.params; // project id
  const { imageUrl } = req.body; // image URL to delete

  if (!imageUrl) {
    return next(new AppError("Image URL is required", 400));
  }

  // 1) Extract file key from image URL
  const fileKey = imageUrl.split(
    `${process.env.SR_PROJECT_IMAGE_BUCKET_PUBLIC_URL}/`
  )[1];
  if (!fileKey) {
    return next(new AppError("Invalid image URL", 400));
  }

  // 2) Delete from R2
  try {
    await s3_ImageUploder.send(
      new DeleteObjectCommand({
        Bucket: process.env.SR_BUCKET_S3_PROJECT_IMAGE,
        Key: fileKey,
      })
    );
  } catch (err) {
    console.error("❌ Failed to delete from R2:", err);
    return next(new AppError("Failed to delete image from storage", 500));
  }

  // 3) Remove from MongoDB galleryImages array
  const updatedProject = await Project.findByIdAndUpdate(
    _id,
    { $pull: { galleryImages: { url: imageUrl } } },
    { new: true }
  );

  if (!updatedProject) {
    return next(new AppError("Project not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Gallery image Deleted successfully",
    data: updatedProject,
  });
});

// 🔥 Delete whole project + all images
exports.deleteProject = catchAsync(async (req, res, next) => {
  const { _id } = req.params;

  // 1) Find project
  const project = await Project.findById(_id);
  if (!project) {
    return next(new AppError("Project not found", 404));
  }

  try {
    // 2) Delete main project image (if exists)
    if (project.mainImage?.url) {
      const mainKey = project.mainImage.url.split(
        `${process.env.SR_PROJECT_IMAGE_BUCKET_PUBLIC_URL}/`
      )[1];

      if (mainKey) {
        await s3_ImageUploder.send(
          new DeleteObjectCommand({
            Bucket: process.env.SR_BUCKET_S3_PROJECT_IMAGE,
            Key: mainKey,
          })
        );
      }
    }

    // 3) Delete all gallery images (if any)
    if (project.galleryImages?.length > 0) {
      const deleteCommands = project.galleryImages
        .map((img) => {
          const fileKey = img.url.split(
            `${process.env.SR_PROJECT_IMAGE_BUCKET_PUBLIC_URL}/`
          )[1];
          if (!fileKey) return null;
          return new DeleteObjectCommand({
            Bucket: process.env.SR_BUCKET_S3_PROJECT_IMAGE,
            Key: fileKey,
          });
        })
        .filter(Boolean);

      if (deleteCommands.length > 0) {
        await Promise.all(
          deleteCommands.map((cmd) => s3_ImageUploder.send(cmd))
        );
      }
    }

    // 4) Delete project from DB
    await Project.findByIdAndDelete(_id);

    res.status(200).json({
      status: "success",
      message: "Project and all images deleted successfully",
    });
  } catch (err) {
    console.error("❌ Failed to delete project:", err);
    return next(new AppError("Failed to delete project or images", 500));
  }
});

exports.updateBlogImage = catchAsync(async (req, res, next) => {
  try {
    console.log("File received:", req.file.originalname.split(".")[0]);

    // 2. Upload to R2
    const fileExtension = req.file.originalname.split(".").pop();
    const fileName = `saranshrealtors-blog-image/${Date.now()}.${fileExtension}`;
    const imageName = req.file.originalname.split(".")[0];

    await s3_ImageUploder.send(
      new PutObjectCommand({
        Bucket: process.env.SR_BUCKET_S3_BLOG_IMAGE,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    // 3. Update Database
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params._id,
      {
        blogImage: {
          url: `${process.env.SR_BLOG_IMAGE_BUCKET_PUBLIC_URL}/${fileName}`,
          altText: imageName,
          title: `saranshrealtors-${imageName}`,
          caption: `${imageName}`,
          description: `This image is related to ${imageName} Real Estate Project`,
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      data: updatedBlog,
      message: "Blog image upload succesfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return next(
      new AppError(
        "Failed to process and upload the image. Please try again.",
        500
      )
    );
  }
});

exports.deleteBlogImage = catchAsync(async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params._id);

    if (!blog) {
      return next(new AppError("Blog not found", 404));
    }

    if (!blog.blogImage || !blog.blogImage.url) {
      return next(new AppError("No image found for this blog", 400));
    }

    // Extract file key from the URL
    const imageUrl = blog.blogImage.url;
    const fileKey = imageUrl.replace(
      `${process.env.SR_BLOG_IMAGE_BUCKET_PUBLIC_URL}/`,
      ""
    );

    // 1. Delete from S3 (R2)
    await s3_ImageUploder.send(
      new DeleteObjectCommand({
        Bucket: process.env.SR_BUCKET_S3_BLOG_IMAGE,
        Key: fileKey,
      })
    );

    // 2. Remove from DB
    blog.blogImage = undefined;
    await blog.save();

    res.status(200).json({
      status: "success",
      message: "Blog image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog image:", error);
    return next(
      new AppError("Failed to delete blog image. Please try again later.", 500)
    );
  }
});

// Delete Blog + Image
exports.deleteBlog = catchAsync(async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params._id);

    if (!blog) {
      return next(new AppError("Blog not found", 404));
    }

    // ✅ If blog has an image, delete from S3 first
    if (blog.blogImage && blog.blogImage.url) {
      const imageUrl = blog.blogImage.url;
      const fileKey = imageUrl.replace(
        `${process.env.SR_BLOG_IMAGE_BUCKET_PUBLIC_URL}/`,
        ""
      );

      try {
        await s3_ImageUploder.send(
          new DeleteObjectCommand({
            Bucket: process.env.SR_BUCKET_S3_BLOG_IMAGE,
            Key: fileKey,
          })
        );
      } catch (err) {
        console.error("Error deleting image from S3:", err.message);
        // Not blocking blog deletion if image deletion fails
      }
    }

    // ✅ Delete blog from DB
    await Blog.findByIdAndDelete(req.params._id);

    res.status(200).json({
      status: "success",
      message: "Blog and associated image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return next(
      new AppError("Failed to delete blog. Please try again later.", 500)
    );
  }
});
