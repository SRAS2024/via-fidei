// server/routes/saints.js
const express = require("express");
const router = express.Router();
const saintsController = require("../controllers/saintsController");
const requireAuth = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

/**
 * Public endpoints
 */

// GET /api/saints - query saints by keyword, feast month, or locale
router.get("/", saintsController.getSaints);

// GET /api/saints/:slug - get saint by slug with localization
router.get("/:slug", saintsController.getSaintBySlug);

/**
 * Authenticated endpoints
 */

// POST /api/saints/:id/save - save saint to user profile
router.post(
  "/:id/save",
  requireAuth,
  validateRequest([]),
  saintsController.saveSaint
);

// DELETE /api/saints/:id/remove - remove saint from user profile
router.delete(
  "/:id/remove",
  requireAuth,
  saintsController.removeSaint
);

module.exports = router;
