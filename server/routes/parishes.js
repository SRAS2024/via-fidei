// server/routes/parishes.js
const express = require("express");
const router = express.Router();
const parishesController = require("../controllers/parishesController");
const requireAuth = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

/**
 * Public endpoints
 */

// GET /api/parishes - search for parishes by coordinates, city, or postal code
router.get("/", parishesController.getParishes);

// GET /api/parishes/:id - get parish details by ID
router.get("/:id", parishesController.getParishById);

/**
 * Authenticated endpoints
 */

// POST /api/parishes/:id/save - save parish to profile
router.post(
  "/:id/save",
  requireAuth,
  validateRequest([]),
  parishesController.saveParish
);

// DELETE /api/parishes/:id/remove - remove parish from profile
router.delete(
  "/:id/remove",
  requireAuth,
  parishesController.removeParish
);

module.exports = router;
