// server/controllers/milestonesController.js
const milestonesService = require("../services/milestonesService");

/**
 * Get all milestones for the logged-in user
 */
exports.getAllMilestones = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const milestones = await milestonesService.getAllMilestones(userId);
    res.json(milestones);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single milestone by ID
 */
exports.getMilestoneById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const milestone = await milestonesService.getMilestoneById(userId, id);
    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    res.json(milestone);
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new milestone
 */
exports.createMilestone = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const milestone = await milestonesService.createMilestone(userId, req.body);
    res.status(201).json(milestone);
  } catch (err) {
    if (err.code === "P2002") {
      // Prisma unique constraint violation
      return res.status(400).json({ error: "Milestone already exists" });
    }
    next(err);
  }
};

/**
 * Update an existing milestone
 */
exports.updateMilestone = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const updated = await milestonesService.updateMilestone(userId, id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a milestone
 */
exports.deleteMilestone = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await milestonesService.deleteMilestone(userId, id);
    if (!deleted) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    res.json({ message: "Milestone deleted successfully" });
  } catch (err) {
    next(err);
  }
};
