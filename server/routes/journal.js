// server/routes/journal.js
const express = require("express");
const router = express.Router();
const journalController = require("../controllers/journalController");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

// All journal routes require authentication
router.use(authMiddleware);

// GET /api/journal - list all journal entries
router.get("/", journalController.getAllEntries);

// GET /api/journal/:id - get a single journal entry
router.get("/:id", journalController.getEntryById);

// POST /api/journal - create a new entry
router.post(
  "/",
  validateRequest(["title", "bodyMarkdown"]),
  journalController.createEntry
);

// PUT /api/journal/:id - update an entry
router.put(
  "/:id",
  validateRequest(["title", "bodyMarkdown", "isSaved", "isFavorite"]),
  journalController.updateEntry
);

// DELETE /api/journal/:id - delete an entry
router.delete("/:id", journalController.deleteEntry);

module.exports = router;
