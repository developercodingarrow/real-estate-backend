const express = require("express");
const app = express();
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
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000", // Next.js frontend
    credentials: true, // allow cookies
  })
);

app.use(express.json({ limit: "10mb" })); // Increase limit

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

app.use(globalErrorHandler);

module.exports = app;
