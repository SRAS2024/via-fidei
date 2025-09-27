// server/controllers/prayersController.js
const prayersService = require("../services/prayersService");

/**
 * GET /api/prayers
 * Query prayers by keyword, category, or locale
 */
exports.getPrayers = async (req, res, next) => {
  try {
    const { query, locale, category } = req.query;
    const prayers = await prayersService.getPrayers({ query, locale, category });
    res.json(prayers);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/prayers/:slug
 * Get prayer by slug with localization
 */
exports.getPrayerBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { locale } = req.query;

    const prayer = await prayersService.getPrayerBySlug(slug, locale);
    if (!prayer) {
      return res.status(404).json({ error: "Prayer not found" });
    }

    res.json(prayer);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/prayers/:id/save
 * Save a prayer to user profile
 */
exports.savePrayer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const saved = await prayersService.savePrayer(userId, id);
    if (!saved) {
      return res.status(400).json({ error: "Prayer already saved" });
    }

    res.json(saved);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/prayers/:id/remove
 * Remove a prayer from user profile
 */
exports.removePrayer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const removed = await prayersService.removePrayer(userId, id);
    if (!removed) {
      return res.status(404).json({ error: "Prayer not in profile" });
    }

    res.json({ message: "Prayer removed successfully" });
  } catch (err) {
    next(err);
  }
};
