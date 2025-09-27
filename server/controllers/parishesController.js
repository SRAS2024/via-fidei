// server/controllers/parishesController.js
const parishesService = require("../services/parishesService");

/**
 * GET /api/parishes
 * Search for parishes by coordinates, city, or postal code
 */
exports.getParishes = async (req, res, next) => {
  try {
    const { lat, lng, city, postal, country } = req.query;
    const parishes = await parishesService.getParishes({
      lat,
      lng,
      city,
      postal,
      country,
    });
    res.json(parishes);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/parishes/:id
 * Get parish details by ID
 */
exports.getParishById = async (req, res, next) => {
  try {
    const parish = await parishesService.getParishById(req.params.id);
    if (!parish) {
      return res.status(404).json({ error: "Parish not found" });
    }
    res.json(parish);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/parishes/:id/save
 * Save parish to profile
 */
exports.saveParish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const saved = await parishesService.saveParish(userId, id);
    if (!saved) {
      return res.status(400).json({ error: "Parish already saved" });
    }

    res.json(saved);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/parishes/:id/remove
 * Remove parish from profile
 */
exports.removeParish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const removed = await parishesService.removeParish(userId, id);
    if (!removed) {
      return res.status(404).json({ error: "Parish not in profile" });
    }

    res.json({ message: "Parish removed successfully" });
  } catch (err) {
    next(err);
  }
};
