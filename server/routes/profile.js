// server/routes/profile.js
const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const requireAuth = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

/**
 * Profile basics
 */
router.get("/", requireAuth, profileController.getProfile);

/**
 * Favorites
 */
router.get("/prayers", requireAuth, profileController.getProfilePrayers);
router.get("/saints", requireAuth, profileController.getProfileSaints);
router.get("/ourladies", requireAuth, profileController.getProfileOurLadies);

/**
 * Journal
 */
router.get("/journal", requireAuth, profileController.getJournalEntries);
router.post(
  "/journal",
  requireAuth,
  validateRequest([]),
  profileController.createJournalEntry
);
router.patch(
  "/journal/:id",
  requireAuth,
  validateRequest([]),
  profileController.updateJournalEntry
);
router.delete("/journal/:id", requireAuth, profileController.deleteJournalEntry);

/**
 * Milestones
 */
router.get("/milestones", requireAuth, profileController.getMilestones);
router.post(
  "/milestones",
  requireAuth,
  validateRequest([]),
  profileController.createMilestone
);
router.patch(
  "/milestones/:id",
  requireAuth,
  validateRequest([]),
  profileController.updateMilestone
);
router.delete("/milestones/:id", requireAuth, profileController.deleteMilestone);

/**
 * Goals
 */
router.get("/goals", requireAuth, profileController.getGoals);
router.post(
  "/goals",
  requireAuth,
  validateRequest([]),
  profileController.createGoal
);
router.patch(
  "/goals/:id",
  requireAuth,
  validateRequest([]),
  profileController.updateGoal
);
router.post(
  "/goals/:id/days/:dayNumber/toggle",
  requireAuth,
  profileController.toggleGoalDay
);
router.delete("/goals/:id", requireAuth, profileController.deleteGoal);

module.exports = router;
