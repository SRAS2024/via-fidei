// server/services/milestonesService.js
const prisma = require("../database/db");

/**
 * Get all milestones for a user
 */
async function getAllMilestones(userId) {
  return prisma.milestone.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get one milestone by ID for a user
 */
async function getMilestoneById(userId, id) {
  return prisma.milestone.findFirst({
    where: { id, userId },
  });
}

/**
 * Create a milestone
 */
async function createMilestone(userId, data) {
  return prisma.milestone.create({
    data: {
      userId,
      type: data.type,
      title: data.title,
      description: data.description,
      iconKey: data.iconKey,
      status: data.status || "PLANNED",
      completedAt: data.completedAt ? new Date(data.completedAt) : null,
    },
  });
}

/**
 * Update a milestone
 */
async function updateMilestone(userId, id, data) {
  // Ensure milestone belongs to the user
  const milestone = await prisma.milestone.findFirst({
    where: { id, userId },
  });
  if (!milestone) return null;

  return prisma.milestone.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      iconKey: data.iconKey,
      status: data.status,
      completedAt: data.completedAt ? new Date(data.completedAt) : null,
    },
  });
}

/**
 * Delete a milestone
 */
async function deleteMilestone(userId, id) {
  // Ensure milestone belongs to the user
  const milestone = await prisma.milestone.findFirst({
    where: { id, userId },
  });
  if (!milestone) return null;

  await prisma.milestone.delete({ where: { id } });
  return true;
}

module.exports = {
  getAllMilestones,
  getMilestoneById,
  createMilestone,
  updateMilestone,
  deleteMilestone,
};
