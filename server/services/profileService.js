// server/services/profileService.js
const prisma = require("../database/db");

/**
 * Profile basics
 */
async function getProfile(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      locale: true,
      theme: true,
      createdAt: true,
    },
  });
}

/**
 * Favorites
 */
async function getProfilePrayers(userId, locale) {
  return prisma.favoritePrayer.findMany({
    where: { userId },
    include: {
      prayer: {
        include: {
          locales: { where: { locale: locale || "en" } },
        },
      },
    },
  });
}

async function getProfileSaints(userId, locale) {
  return prisma.favoriteSaint.findMany({
    where: { userId },
    include: {
      saint: {
        include: {
          locales: { where: { locale: locale || "en" } },
        },
      },
    },
  });
}

async function getProfileOurLadies(userId, locale) {
  return prisma.favoriteOurLady.findMany({
    where: { userId },
    include: {
      ourLady: {
        include: {
          locales: { where: { locale: locale || "en" } },
        },
      },
    },
  });
}

/**
 * Journal
 */
async function getJournalEntries(userId) {
  return prisma.journalEntry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

async function createJournalEntry(userId, title, body) {
  return prisma.journalEntry.create({
    data: {
      userId,
      title,
      bodyMarkdown: body,
    },
  });
}

async function updateJournalEntry(entryId, title, body) {
  return prisma.journalEntry.update({
    where: { id: entryId },
    data: { title, bodyMarkdown: body },
  });
}

async function deleteJournalEntry(entryId) {
  return prisma.journalEntry.delete({ where: { id: entryId } });
}

/**
 * Milestones
 */
async function getMilestones(userId) {
  return prisma.milestone.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

async function createMilestone(userId, type, title, description, iconKey) {
  return prisma.milestone.create({
    data: {
      userId,
      type,
      title,
      description,
      iconKey,
      status: "planned",
    },
  });
}

async function updateMilestone(milestoneId, status, completedAt) {
  return prisma.milestone.update({
    where: { id: milestoneId },
    data: { status, completedAt },
  });
}

async function deleteMilestone(milestoneId) {
  return prisma.milestone.delete({ where: { id: milestoneId } });
}

/**
 * Goals
 */
async function getGoals(userId) {
  return prisma.goal.findMany({
    where: { userId },
    include: { days: true },
  });
}

async function createGoal(userId, title, description, days) {
  return prisma.goal.create({
    data: {
      userId,
      title,
      description,
      type: "generic",
      status: "in_progress",
      days: {
        create: days.map((day, i) => ({
          dayNumber: i + 1,
          checklistJson: day.checklist || [],
        })),
      },
    },
    include: { days: true },
  });
}

async function updateGoal(goalId, title, description, status) {
  return prisma.goal.update({
    where: { id: goalId },
    data: { title, description, status },
  });
}

async function toggleGoalDay(goalId, dayNumber) {
  const day = await prisma.goalDay.findFirst({
    where: { goalId, dayNumber },
  });

  if (!day) return null;

  return prisma.goalDay.update({
    where: { id: day.id },
    data: {
      isCompleted: !day.isCompleted,
      completedAt: !day.isCompleted ? new Date() : null,
    },
  });
}

async function deleteGoal(goalId) {
  return prisma.goal.delete({ where: { id: goalId } });
}

module.exports = {
  getProfile,
  getProfilePrayers,
  getProfileSaints,
  getProfileOurLadies,
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  getGoals,
  createGoal,
  updateGoal,
  toggleGoalDay,
  deleteGoal,
};
