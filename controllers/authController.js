const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const Factory = require("../utils/handlerFactory");
const xss = require("xss");
const sendEmail = require("../utils/email");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const HashOTP = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const encryptedOtp = await bcrypt.hash(otp, 12);
  return {
    otp,
    encryptedOtp,
  };
};

const OtpURL = () => {
  const UrlToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(UrlToken)
    .digest("hex");

  return {
    UrlToken,
    hashedToken,
  };
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 36000,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookiesOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "None",
  };

  if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;
  res.cookie("jwt", token, cookiesOptions);

  res.status(statusCode).json({
    status: "success",
    apiFor: "Login",
    token,
    message: "login succes fully",
    user, // user ki sari details  send nahi karni
  });
};

exports.superAdminRegisteraion = catchAsync(async (req, res, next) => {
  //1) GET DATA FROM BODY
  const name = xss(req.body.name);
  const email = xss(req.body.email);
  //2)CHECK THE USER FIELD IS EMPTY
  if (!name || !email) {
    return next(new AppError("Please Provide Required filed", 400));
  }

  // 3) VALIDATE EMAIL
  const allowedEmails = [
    "digitalcloudinfo@gmail.com",
    "info@saranshrealtors.com",
  ];
  if (!allowedEmails.includes(email)) {
    return next(new AppError("Unauthorized email. Access denied.", 403));
  }
  //3) CHECK USER ALREADY REGISTER
  const checkUser = await User.findOne({ email });

  // check input filed isEmpity
  if (checkUser) {
    return next(new AppError("Admin Already resgister", 400));
  }

  const newAdmin = await User.create({
    name,
    email,
    role: "superAdmin",
  });

  res.status(200).json({
    status: "success",
    data: newAdmin,
  });
});

// (2 Admin Login Controller
exports.superAdminLogin = catchAsync(async (req, res, next) => {
  //1) GET DATA FROM BODY
  const email = xss(req.body.email);
  //3) CHECK USER ALREADY REGISTER
  const admin = await User.findOne({ email });

  // 2) VALIDATE EMAIL
  const allowedEmails = [
    "digitalcloudinfo@gmail.com",
    "info@saranshrealtors.com",
  ];
  if (!allowedEmails.includes(email)) {
    return next(new AppError("Unauthorized email. Access denied.", 403));
  }

  if (!admin) {
    return next(new AppError("data not found", 400));
  }

  const { otp, encryptedOtp } = await HashOTP();
  const { UrlToken, hashedToken } = OtpURL();

  admin.otp = encryptedOtp;
  admin.otpTimestamp = new Date();
  admin.otpgenerateToken = hashedToken;
  await admin.save();

  const otpverificationURL = `http://localhost:3000/auth/otpverification/${UrlToken}`;

  try {
    await sendEmail({
      email: email,
      subject: "Saransh Realtors Super Admin Login",
      message: `<h1>This is your one-time OTP: ${otp} for Super Admin. Please use the OTP to Login your account.</h1>
                <br>Click on this link to verify: <a href="${otpverificationURL}">Verify OTP</a>`,
    });

    res.status(200).json({
      status: "success",
      apiFor: "login",
      message: "OTP sent successfully, please check your email.",
      UrlToken,
      // Don't send OTP or newUser details in the response
    });
  } catch (error) {
    // Handle error in case the email fails to send
    return next(
      new AppError(
        "There was an error sending the email. Try again later.",
        500
      )
    );
  }
});

exports.otpLogin = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // 1) Get the admin by hashedToken
  const admin = await User.findOne({ otpgenerateToken: hashedToken });
  console.log("admin--", admin);

  if (!admin) {
    return next(new AppError("Invalid token or user not found.", 404));
  }

  // 2) Verify OTP and expiration time
  const enteredOtp = req.body.otp.replace(/\s+/g, ""); // Remove any spaces from the OTP
  const currentTime = new Date();

  if (
    (await bcrypt.compare(enteredOtp, admin.otp)) && // Use `admin.otp` (not `Admin.otp`)
    currentTime.getTime() - admin.otpTimestamp.getTime() <= 600000 // Use `admin.otpTimestamp`
  ) {
    // 3) Clear OTP-related fields and mark as verified
    admin.otp = undefined;
    admin.otpgenerateToken = undefined;
    admin.isVerified = true;

    await admin.save(); // Save changes to the admin document

    createSendToken(admin, 200, res); // Send token on success
  } else {
    return next(new AppError("Invalid OTP or expired. Please try again.", 404));
  }
});

exports.logOut = catchAsync(async (req, res, next) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: process.env.NODE_ENV === "production", // Ensure secure is used only in production
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});
