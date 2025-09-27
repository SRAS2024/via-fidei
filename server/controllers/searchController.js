// server/controllers/searchController.js
const searchService = require("../services/searchService");

/**
 * GET /api/search
 * Search across prayers, saints, our ladies, guides, and parishes
 */
exports.globalSearch = async (req, res, next) => {
  try {
    const { q, type, locale } = req.query;
    const searchTerm = q?.trim();

    if (!searchTerm) {
      return res.status(400).json({ error: "Query (q) is required" });
    }

    const results = await searchService.globalSearch(searchTerm, type, locale);

    res.json({ count: results.length, results });
  } catch (err) {
    next(err);
  }
};
