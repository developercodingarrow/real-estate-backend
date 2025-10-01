const mongoose = require("mongoose");
const slugify = require("slugify");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please Tell us your name!"],
      lowercase: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    email: {
      type: String,
      require: [true, "Please Provide your email!"],
      unique: true,
      lowercase: true,
    },

    role: {
      type: String,
      enum: ["superAdmin", "admin", "editor"],
      default: "editor",
    },
    otp: String,
    otpTimestamp: Date,
    otpgenerateToken: String,
  },
  { timestamps: true }
);

// Middleware to generate slug before saving
userSchema.pre("save", function (next) {
  this.email = this.email.toLowerCase(); // Convert email to lowercase
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
