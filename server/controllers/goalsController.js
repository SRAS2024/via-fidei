// server/controllers/goalsController.js
const goalsService = require("../services/goalsService");

/**
 * Get all goals for the logged-in user
 */
exports.getAllGoals = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const goals = await goalsService.getAllGoals(userId);
    res.json(goals);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single goal by ID
 */
exports.getGoalById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const goal = await goalsService.getGoalById(userId, id);
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json(goal);
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new goal
 */
exports.createGoal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const goal = await goalsService.createGoal(userId, req.body);
    res.status(201).json(goal);
  } catch (err) {
    next(err);
  }
};

/**
 * Update an existing goal
 */
exports.updateGoal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const updated = await goalsService.updateGoal(userId, id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a goal
 */
exports.deleteGoal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await goalsService.deleteGoal(userId, id);
    if (!deleted) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json({ message: "Goal deleted successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all days for a goal
 */
exports.getGoalDays = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { goalId } = req.params;

    const days = await goalsService.getGoalDays(userId, goalId);
    if (!days) {
      return res.status(404).json({ error: "Goal not found or no days exist" });
    }

    res.json(days);
  } catch (err) {
    next(err);
  }
};

/**
 * Update a specific day in a goal
 */
exports.updateGoalDay = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { goalId, dayNumber } = req.params;

    const updatedDay = await goalsService.updateGoalDay(
      userId,
      goalId,
      parseInt(dayNumber, 10),
      req.body
    );

    if (!updatedDay) {
      return res.status(404).json({ error: "Goal or Goal Day not found" });
    }

    res.json(updatedDay);
  } catch (err) {
    next(err);
  }
};
