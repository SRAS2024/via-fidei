// server/services/guidesService.js
const prisma = require("../database/db");

/**
 * Get a single guide by slug with localized content and steps
 */
async function getGuideBySlug(slug, locale) {
  return prisma.guide.findUnique({
    where: { slug },
    include: {
      locales: { where: { locale: locale || "en" } },
      steps: {
        orderBy: { order: "asc" },
        include: {
          locales: { where: { locale: locale || "en" } },
        },
      },
    },
  });
}

/**
 * Save a guide to user profile as a favorite
 */
async function saveGuide(userId, guideId) {
  const existing = await prisma.favorite.findFirst({
    where: { userId, entityType: "guide", entityId: guideId },
  });
  if (existing) return null;

  return prisma.favorite.create({
    data: {
      userId,
      entityType: "guide",
      entityId: guideId,
    },
  });
}

/**
 * Turn a guide into a structured goal with daily checklist
 */
async function addGuideAsGoal(userId, guideId) {
  const guide = await prisma.guide.findUnique({
    where: { id: guideId },
    include: { steps: true },
  });
  if (!guide) return null;

  return prisma.goal.create({
    data: {
      userId,
      title: guide.slug,
      description: "Checklist created from guide",
      type: "TEMPLATE",
      templateId: guide.id,
      status: "IN_PROGRESS",
      days: {
        create: guide.steps.map((step, i) => ({
          dayNumber: i + 1,
          checklistJson: step.checklistJson || [],
        })),
      },
    },
    include: { days: true },
  });
}

module.exports = {
  getGuideBySlug,
  saveGuide,
  addGuideAsGoal,
};
