// server/middleware/sendResetEmail.js
const nodemailer = require("nodemailer");

async function sendResetEmail(toEmail, resetLink) {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM) {
    throw new Error("Missing required email environment variables");
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT == 465, // use TLS if port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Via Fidei Support" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: "Password Reset - Via Fidei",
      text: `You requested to reset your password. Use this link within 1 hour: ${resetLink}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password for your Via Fidei account.</p>
          <p>Click the link below to choose a new password. This link will expire in 1 hour:</p>
          <p><a href="${resetLink}" style="color: #3b82f6;">Reset Password</a></p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${toEmail}`);
    return true;
  } catch (err) {
    console.error("Error sending reset email:", err);
    throw new Error("Email delivery failed");
  }
}

module.exports = sendResetEmail;
