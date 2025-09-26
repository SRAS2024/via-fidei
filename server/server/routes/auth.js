// server/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const db = require("../database/db"); // database client
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
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email, password, displayName } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await db.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          displayName,
        },
      });

      const token = generateToken(user);
      res.json({ token, user: { id: user.id, email: user.email, displayName: user.displayName } });
    } catch (err) {
      console.error(err);
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
      res.json({ token, user: { id: user.id, email: user.email, displayName: user.displayName } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Login failed" });
    }
  }
);

// @route   POST /api/auth/logout
router.post("/logout", (req, res) => {
  // Client deletes token, but we send success for consistency
  res.json({ message: "Logged out successfully" });
});

// @route   POST /api/auth/forgot
router.post("/forgot", [body("email").isEmail()], async (req, res) => {
  try {
    const { email } = req.body;
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const resetLink = `${process.env.SITE_URL}/reset-password?token=${resetToken}`;

    await sendResetEmail(email, resetLink);

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
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

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const hashedPassword = await bcrypt.hash(password, 10);

      await db.user.update({
        where: { id: decoded.id },
        data: { passwordHash: hashedPassword },
      });

      res.json({ message: "Password reset successful" });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Invalid or expired token" });
    }
  }
);

module.exports = router;
