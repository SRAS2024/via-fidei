// server/routes/prayers.js
const express = require("express");
const router = express.Router();
const prayersController = require("../controllers/prayersController");
const requireAuth = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

/**
 * Public endpoints
 */

// GET /api/prayers - query prayers by keyword, category, or locale
router.get("/", prayersController.getPrayers);

// GET /api/prayers/:slug - get prayer by slug with localization
router.get("/:slug", prayersController.getPrayerBySlug);

/**
 * Authenticated endpoints
 */

// POST /api/prayers/:id/save - save a prayer to user profile
router.post(
  "/:id/save",
  requireAuth,
  validateRequest([]),
  prayersController.savePrayer
);

// DELETE /api/prayers/:id/remove - remove a prayer from user profile
router.delete(
  "/:id/remove",
  requireAuth,
  prayersController.removePrayer
);

module.exports = router;
