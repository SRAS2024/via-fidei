// server/middleware/sendResetEmail.js
const nodemailer = require("nodemailer");

async function sendResetEmail(toEmail, resetLink) {
  try {
    // Transporter setup - use environment variables for security
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,       // e.g., "smtp.sendgrid.net"
      port: process.env.EMAIL_PORT || 587,
      secure: false,                      // true if using port 465
      auth: {
        user: process.env.EMAIL_USER,     // API key or SMTP username
        pass: process.env.EMAIL_PASS,     // API secret or SMTP password
      },
    });

    // Email content
    const mailOptions = {
      from: `"Via Fidei Support" <${process.env.EMAIL_FROM}>`,
      to: toEmail,
      subject: "Password Reset - Via Fidei",
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

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(`Password reset email sent to ${toEmail}`);
    return true;
  } catch (err) {
    console.error("Error sending reset email:", err);
    throw new Error("Email delivery failed");
  }
}

module.exports = sendResetEmail;
