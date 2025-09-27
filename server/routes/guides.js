// server/routes/guides.js
const express = require("express");
const router = express.Router();
const guidesController = require("../controllers/guidesController");
const requireAuth = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

/**
 * Public endpoints
 */

// GET /api/guides/:slug - get a single guide with localized content and steps
router.get("/:slug", guidesController.getGuideBySlug);

/**
 * Authenticated endpoints
 */

// POST /api/guides/:id/save - save a guide to user profile as a favorite
router.post(
  "/:id/save",
  requireAuth,
  validateRequest([]),
  guidesController.saveGuide
);

// POST /api/guides/:id/add-goal - turn a guide into a structured goal with daily checklist
router.post(
  "/:id/add-goal",
  requireAuth,
  guidesController.addGuideAsGoal
);

module.exports = router;
