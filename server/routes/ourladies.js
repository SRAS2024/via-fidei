// server/routes/ourladies.js
const express = require("express");
const router = express.Router();
const ourLadiesController = require("../controllers/ourLadiesController");
const requireAuth = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

/**
 * Public endpoints
 */

// GET /api/ourladies - query apparitions by keyword, feast month, or locale
router.get("/", ourLadiesController.getOurLadies);

// GET /api/ourladies/:slug - get apparition by slug with localization
router.get("/:slug", ourLadiesController.getOurLadyBySlug);

/**
 * Authenticated endpoints
 */

// POST /api/ourladies/:id/save - save apparition to user profile
router.post(
  "/:id/save",
  requireAuth,
  validateRequest([]),
  ourLadiesController.saveOurLady
);

// DELETE /api/ourladies/:id/remove - remove apparition from user profile
router.delete(
  "/:id/remove",
  requireAuth,
  ourLadiesController.removeOurLady
);

module.exports = router;
