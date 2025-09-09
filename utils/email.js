const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Set up transport configuration based on the environment
  let transporter;
  if (process.env.NODE_ENV === "development") {
    transporter = nodemailer.createTransport({
      host: process.env.Mailtrap_EMAIL_HOST,
      port: process.env.Mailtrap_EMAIL_PORT,
      auth: {
        user: process.env.Mailtrap_EMAIL_USER, // Development email user
        pass: process.env.Miltrap_EMAIL_PASSWORD, // Development email password
      },
    });
  } else if (process.env.NODE_ENV === "production") {
    transporter = nodemailer.createTransport({
      host: process.env.Mailtrap_EMAIL_HOST,
      port: process.env.Mailtrap_EMAIL_PORT,
      auth: {
        user: process.env.Mailtrap_EMAIL_USER, // Development email user
        pass: process.env.Miltrap_EMAIL_PASSWORD, // Development email password
      },
    });
  }

  // Define the email options
  const mailOptions = {
    from: '"saranshrealtors.com 👻" <noreply@saranshrealtors.com>', // sender address
    to: options.email,
    subject: options.subject,
    html: `<div style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333;">Hello!</h1>
        <p style="color: #555;">
          ${options.message}
        </p>
        <p style="color: #555;">Thank you for using our service!</p>
        <footer style="margin-top: 20px; font-size: 12px; color: #888;">
          <p>Best regards,</p>
          <p>Pinbuzzers Team</p>
          <p><a href="http://saranshrealtors.com" style="color: #007BFF; text-decoration: none;">Visit our website</a></p>
        </footer>
      </div>
    </div>`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
