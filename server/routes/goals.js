// server/routes/goals.js
const express = require("express");
const router = express.Router();
const goalsController = require("../controllers/goalsController");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

// All goal routes require authentication
router.use(authMiddleware);

/**
 * Goals
 */

// GET /api/goals - list all goals for the user
router.get("/", goalsController.getAllGoals);

// GET /api/goals/:id - get a single goal
router.get("/:id", goalsController.getGoalById);

// POST /api/goals - create a new goal
router.post(
  "/",
  validateRequest(["title"]), // title required, description optional
  goalsController.createGoal
);

// PUT /api/goals/:id - update a goal
router.put(
  "/:id",
  validateRequest(["title", "description", "status", "dueDate", "completedAt"]),
  goalsController.updateGoal
);

// DELETE /api/goals/:id - delete a goal
router.delete("/:id", goalsController.deleteGoal);

/**
 * Goal Days (nested)
 */

// GET /api/goals/:goalId/days - list all days for a goal
router.get("/:goalId/days", goalsController.getGoalDays);

// PUT /api/goals/:goalId/days/:dayNumber - update a specific day in a goal
router.put(
  "/:goalId/days/:dayNumber",
  validateRequest(["checklistJson", "isCompleted", "completedAt"]),
  goalsController.updateGoalDay
);

module.exports = router;
