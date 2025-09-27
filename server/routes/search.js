// server/routes/search.js
const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const validateRequest = require("../middleware/validateRequest");

/**
 * Public endpoint
 */

// GET /api/search - search across prayers, saints, our ladies, guides, and parishes
router.get("/", validateRequest([]), searchController.globalSearch);

module.exports = router;
