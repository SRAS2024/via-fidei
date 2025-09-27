// server/controllers/ourLadiesController.js
const ourLadiesService = require("../services/ourLadiesService");

/**
 * GET /api/ourladies
 * Query Our Lady apparitions by keyword, feast month, or locale
 */
exports.getOurLadies = async (req, res, next) => {
  try {
    const { query, locale, feastMonth } = req.query;
    const apparitions = await ourLadiesService.getOurLadies({
      query,
      locale,
      feastMonth,
    });
    res.json(apparitions);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/ourladies/:slug
 * Get apparition by slug with localization
 */
exports.getOurLadyBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { locale } = req.query;

    const apparition = await ourLadiesService.getOurLadyBySlug(slug, locale);
    if (!apparition) {
      return res.status(404).json({ error: "Our Lady apparition not found" });
    }

    res.json(apparition);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/ourladies/:id/save
 * Save an apparition to user profile
 */
exports.saveOurLady = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const saved = await ourLadiesService.saveOurLady(userId, id);
    if (!saved) {
      return res.status(400).json({ error: "Apparition already saved" });
    }

    res.json(saved);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/ourladies/:id/remove
 * Remove an apparition from user profile
 */
exports.removeOurLady = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const removed = await ourLadiesService.removeOurLady(userId, id);
    if (!removed) {
      return res
        .status(404)
        .json({ error: "Apparition not found in user profile" });
    }

    res.json({ message: "Apparition removed successfully" });
  } catch (err) {
    next(err);
  }
};
