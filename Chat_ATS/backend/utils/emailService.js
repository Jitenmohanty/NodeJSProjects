import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("Email User:", process.env.EMAIL_USER); // Should print your email
console.log(
  "Email Pass:",
  process.env.EMAIL_PASS ? "***Loaded***" : "MISSING!"
);

const transporter = nodemailer.createTransport({
  secure: true, // The email service provider
  host: "smtp.gmail.com", // The SMTP server host
  port: 465, // The port number for SMTP communication
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS,
  }
});

export const sendVerificationEmail = async (email, otp) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-otp?email=${email}&otp=${otp}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>Or click this link to verify:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This OTP will expire in 15 minutes</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};
