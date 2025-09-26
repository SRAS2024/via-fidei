// server/services/goalsService.js
const prisma = require("../database/db");

/**
 * Get all goals for a user
 */
async function getAllGoals(userId) {
  return prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { days: true },
  });
}

/**
 * Get a single goal by ID for a user
 */
async function getGoalById(userId, id) {
  return prisma.goal.findFirst({
    where: { id, userId },
    include: { days: true },
  });
}

/**
 * Create a new goal
 */
async function createGoal(userId, data) {
  return prisma.goal.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      type: data.type || "GENERIC",
      templateId: data.templateId || null,
      status: data.status || "IN_PROGRESS",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      completedAt: data.completedAt ? new Date(data.completedAt) : null,
    },
    include: { days: true },
  });
}

/**
 * Update an existing goal
 */
async function updateGoal(userId, id, data) {
  const goal = await prisma.goal.findFirst({ where: { id, userId } });
  if (!goal) return null;

  return prisma.goal.update({
    where: { id },
    data: {
      title: data.title ?? goal.title,
      description: data.description ?? goal.description,
      status: data.status ?? goal.status,
      dueDate: data.dueDate ? new Date(data.dueDate) : goal.dueDate,
      completedAt: data.completedAt ? new Date(data.completedAt) : goal.completedAt,
    },
    include: { days: true },
  });
}

/**
 * Delete a goal
 */
async function deleteGoal(userId, id) {
  const goal = await prisma.goal.findFirst({ where: { id, userId } });
  if (!goal) return null;

  await prisma.goal.delete({ where: { id } });
  return true;
}

/**
 * Get all days for a goal
 */
async function getGoalDays(userId, goalId) {
  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
    include: { days: true },
  });
  if (!goal) return null;

  return goal.days;
}

/**
 * Update a specific goal day
 */
async function updateGoalDay(userId, goalId, dayNumber, data) {
  // Ensure goal exists for the user
  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
  });
  if (!goal) return null;

  const day = await prisma.goalDay.findFirst({
    where: { goalId, dayNumber },
  });
  if (!day) return null;

  return prisma.goalDay.update({
    where: { id: day.id },
    data: {
      checklistJson: data.checklistJson ?? day.checklistJson,
      isCompleted: data.isCompleted ?? day.isCompleted,
      completedAt: data.completedAt
        ? new Date(data.completedAt)
        : data.isCompleted
        ? new Date()
        : null,
    },
  });
}

module.exports = {
  getAllGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalDays,
  updateGoalDay,
};
