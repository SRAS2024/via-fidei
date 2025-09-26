// server/controllers/milestonesController.js
const prisma = require("../database/db");

/**
 * Get all milestones for the logged-in user
 */
exports.getAllMilestones = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const milestones = await prisma.milestone.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

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

    const milestone = await prisma.milestone.findFirst({
      where: { id, userId },
    });

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
    const { type, title, description, iconKey, status, completedAt } = req.body;

    const milestone = await prisma.milestone.create({
      data: {
        userId,
        type,
        title,
        description,
        iconKey,
        status: status || "PLANNED",
        completedAt: completedAt ? new Date(completedAt) : null,
      },
    });

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
    const { title, description, iconKey, status, completedAt } = req.body;

    const milestone = await prisma.milestone.findFirst({
      where: { id, userId },
    });

    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    const updated = await prisma.milestone.update({
      where: { id },
      data: {
        title,
        description,
        iconKey,
        status,
        completedAt: completedAt ? new Date(completedAt) : null,
      },
    });

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

    const milestone = await prisma.milestone.findFirst({
      where: { id, userId },
    });

    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    await prisma.milestone.delete({ where: { id } });

    res.json({ message: "Milestone deleted successfully" });
  } catch (err) {
    next(err);
  }
};
