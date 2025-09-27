// server/controllers/guidesController.js
const guidesService = require("../services/guidesService");

/**
 * GET /api/guides/:slug
 * Get a single guide with localized content and steps
 */
exports.getGuideBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { locale } = req.query;

    const guide = await guidesService.getGuideBySlug(slug, locale);
    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }

    res.json(guide);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/guides/:id/save
 * Save a guide to user profile as a favorite
 */
exports.saveGuide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const saved = await guidesService.saveGuide(userId, id);
    if (!saved) {
      return res.status(400).json({ error: "Guide already saved" });
    }

    res.json(saved);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/guides/:id/add-goal
 * Turn a guide into a structured goal with daily checklist
 */
exports.addGuideAsGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const goal = await guidesService.addGuideAsGoal(userId, id);
    if (!goal) {
      return res.status(404).json({ error: "Guide not found" });
    }

    res.json(goal);
  } catch (err) {
    next(err);
  }
};
