// server/controllers/saintsController.js
const saintsService = require("../services/saintsService");

/**
 * GET /api/saints
 * Query saints by keyword, feast month, or locale
 */
exports.getSaints = async (req, res, next) => {
  try {
    const { query, locale, feastMonth } = req.query;
    const saints = await saintsService.getSaints({ query, locale, feastMonth });
    res.json(saints);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/saints/:slug
 * Get saint by slug with localization
 */
exports.getSaintBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { locale } = req.query;

    const saint = await saintsService.getSaintBySlug(slug, locale);
    if (!saint) {
      return res.status(404).json({ error: "Saint not found" });
    }

    res.json(saint);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/saints/:id/save
 * Save a saint to user profile
 */
exports.saveSaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const saved = await saintsService.saveSaint(userId, id);
    if (!saved) {
      return res.status(400).json({ error: "Saint already saved" });
    }

    res.json(saved);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/saints/:id/remove
 * Remove a saint from user profile
 */
exports.removeSaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const removed = await saintsService.removeSaint(userId, id);
    if (!removed) {
      return res.status(404).json({ error: "Saint not in profile" });
    }

    res.json({ message: "Saint removed successfully" });
  } catch (err) {
    next(err);
  }
};
