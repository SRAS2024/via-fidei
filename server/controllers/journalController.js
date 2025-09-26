// server/controllers/journalController.js
const journalService = require("../services/journalService");

/**
 * Get all journal entries for the logged-in user
 */
exports.getAllEntries = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const entries = await journalService.getAllEntries(userId);
    res.json(entries);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single journal entry by ID
 */
exports.getEntryById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const entry = await journalService.getEntryById(userId, id);
    if (!entry) {
      return res.status(404).json({ error: "Journal entry not found" });
    }

    res.json(entry);
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new journal entry
 */
exports.createEntry = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const entry = await journalService.createEntry(userId, req.body);
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};

/**
 * Update an existing journal entry
 */
exports.updateEntry = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const updated = await journalService.updateEntry(userId, id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Journal entry not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a journal entry
 */
exports.deleteEntry = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await journalService.deleteEntry(userId, id);
    if (!deleted) {
      return res.status(404).json({ error: "Journal entry not found" });
    }

    res.json({ message: "Journal entry deleted successfully" });
  } catch (err) {
    next(err);
  }
};
