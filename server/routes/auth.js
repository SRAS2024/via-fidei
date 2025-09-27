// server/routes/auth.js
const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");

/**
 * Public endpoints
 */

// Register
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password too short"),
    body("displayName").notEmpty().withMessage("Display name required"),
  ],
  validateRequest,
  authController.register
);

// Login
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  validateRequest,
  authController.login
);

// Logout (client-side token removal, just acknowledge)
router.post("/logout", authController.logout);

// Forgot password
router.post(
  "/forgot",
  [body("email").isEmail().withMessage("Valid email required")],
  validateRequest,
  authController.forgotPassword
);

// Reset password
router.post(
  "/reset",
  [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("password").isLength({ min: 6 }).withMessage("Password too short"),
  ],
  validateRequest,
  authController.resetPassword
);

module.exports = router;
