const express = require("express");
const app = express();
var cookieParser = require("cookie-parser");
const globalErrorHandler = require("./utils/errorController");
const projectRouter = require("./routes/projectRoute");
const cloudImageUplodRoute = require("./routes/cdnImageUplodRoute");
const amenitiesRoute = require("./routes/amenitiesRoute");
const builderRoute = require("./routes/builderRoute");
const cityRoute = require("./routes/cityRoute");
const locationRoute = require("./routes/locationRoute");
const blogRoute = require("./routes/blogRoute");
const enquireRoute = require("./routes/enquireRoute");
const authRoute = require("./routes/authRoute");
const statsRoute = require("./routes/statsRoute");
const excelDataRoute = require("./routes/excelDataRoute");
const backupRoute = require("./routes/backupRoute");
const restoreRoute = require("./routes/restoreRoute");
const cors = require("cors");

// 🔒 Security Middlewares
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const { xss } = require("express-xss-sanitizer");
const compression = require("compression");
// ✅ 1. Helmet (set security headers)
app.use(helmet());
// ✅ 2. Rate limiting
const limiter = rateLimit({
  max: 100, // max requests per windowMs
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: "Too many requests from this IP, please try again later!",
});
app.use("/api", limiter);

// ✅ 3. Body parser (limit size)
app.use(express.json({ limit: "10mb" }));

// ✅ 4. Cookie parser
app.use(cookieParser());

// ✅ 5. Data sanitization against NoSQL injection
app.use(mongoSanitize());

// ✅ 6. Data sanitization against XSS
app.use(xss());
// ✅ 7. Prevent parameter pollution
app.use(hpp());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://dashboardrealestate.litversehub.com"
        : "http://localhost:3302",
    credentials: true,
  })
);

// ✅ 9. Compression for better performance
app.use(compression());

app.use("/api/v1/real-estate/admin/auth", authRoute);
app.use("/api/v1/real-estate/admin/project", projectRouter);
app.use("/api/v1/real-estate/admin/cdn-imge-upload", cloudImageUplodRoute);
app.use("/api/v1/real-estate/admin/amenity", amenitiesRoute);
app.use("/api/v1/real-estate/admin/builder", builderRoute);
app.use("/api/v1/real-estate/admin/city", cityRoute);
app.use("/api/v1/real-estate/admin/location", locationRoute);
app.use("/api/v1/real-estate/admin/blog", blogRoute);
app.use("/api/v1/real-estate/admin/enquire", enquireRoute);
app.use("/api/v1/real-estate/admin/stats", statsRoute);
app.use("/api/v1/real-estate/admin/excel", excelDataRoute);
app.use("/api/v1/real-estate/admin/backup", backupRoute);
app.use("/api/v1/real-estate/admin/restore", restoreRoute);

app.use(globalErrorHandler);

module.exports = app;
