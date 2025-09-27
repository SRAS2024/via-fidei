// server/services/ourLadiesService.js
const prisma = require("../database/db");

/**
 * Query Our Lady apparitions by keyword, feast month, or locale
 */
async function getOurLadies({ query, locale, feastMonth }) {
  return prisma.ourLady.findMany({
    where: {
      ...(feastMonth && {
        feastDate: {
          gte: new Date(`${feastMonth}-01`),
          lt: new Date(`${feastMonth}-31`),
        },
      }),
      ...(query && {
        locales: {
          some: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { biographyHtml: { contains: query, mode: "insensitive" } },
            ],
            ...(locale && { locale }),
          },
        },
      }),
    },
    include: {
      locales: { where: { locale: locale || "en" } },
    },
    orderBy: { feastDate: "asc" },
    take: 50,
  });
}

/**
 * Get apparition by slug with localization
 */
async function getOurLadyBySlug(slug, locale) {
  return prisma.ourLady.findUnique({
    where: { slug },
    include: {
      locales: { where: { locale: locale || "en" } },
    },
  });
}

/**
 * Save an apparition to user profile
 */
async function saveOurLady(userId, ourLadyId) {
  const existing = await prisma.favoriteOurLady.findFirst({
    where: { userId, ourLadyId },
  });
  if (existing) return null;

  return prisma.favoriteOurLady.create({
    data: { userId, ourLadyId },
  });
}

/**
 * Remove an apparition from user profile
 */
async function removeOurLady(userId, ourLadyId) {
  const deleted = await prisma.favoriteOurLady.deleteMany({
    where: { userId, ourLadyId },
  });
  if (!deleted.count) return null;

  return true;
}

module.exports = {
  getOurLadies,
  getOurLadyBySlug,
  saveOurLady,
  removeOurLady,
};
