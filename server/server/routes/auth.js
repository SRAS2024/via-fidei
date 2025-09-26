// server/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");

const db = require("../database/db"); // Prisma client
const sendResetEmail = require("../middleware/sendResetEmail");

// Helper: generate JWT
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// @route   POST /api/auth/register
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password too short"),
    body("displayName").notEmpty().withMessage("Display name required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, displayName } = req.body;

      const existing = await db.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await db.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          displayName,
        },
      });

      const token = generateToken(user);
      res.json({
        token,
        user: { id: user.id, email: user.email, displayName: user.displayName },
      });
    } catch (err) {
      console.error("Error in register:", err);
      res.status(500).json({ error: "Registration failed" });
    }
  }
);

// @route   POST /api/auth/login
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await db.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      const token = generateToken(user);
      res.json({
        token,
        user: { id: user.id, email: user.email, displayName: user.displayName },
      });
    } catch (err) {
      console.error("Error in login:", err);
      res.status(500).json({ error: "Login failed" });
    }
  }
);

// @route   POST /api/auth/logout
router.post("/logout", (req, res) => {
  // Client deletes token, server just returns success
  res.json({ message: "Logged out successfully" });
});

// @route   POST /api/auth/forgot
router.post("/forgot", [body("email").isEmail()], async (req, res) => {
  try {
    const { email } = req.body;
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Save to DB
    await db.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExp },
    });

    // Create link
    const resetLink = `${process.env.SITE_URL}/reset-password?token=${resetToken}`;

    await sendResetEmail(email, resetLink);

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Error in forgot password:", err);
    res.status(500).json({ error: "Failed to send reset email" });
  }
});

// @route   POST /api/auth/reset
router.post(
  "/reset",
  [
    body("token").notEmpty(),
    body("password").isLength({ min: 6 }).withMessage("Password too short"),
  ],
  async (req, res) => {
    try {
      const { token, password } = req.body;

      const user = await db.user.findFirst({
        where: { resetToken: token, resetTokenExp: { gte: new Date() } },
      });

      if (!user) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await db.user.update({
        where: { id: user.id },
        data: {
          passwordHash: hashedPassword,
          resetToken: null,
          resetTokenExp: null,
        },
      });

      res.json({ message: "Password reset successful" });
    } catch (err) {
      console.error("Error in reset password:", err);
      res.status(400).json({ error: "Invalid or expired token" });
    }
  }
);

module.exports = router;
