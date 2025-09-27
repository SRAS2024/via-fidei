// server/services/saintsService.js
const prisma = require("../database/db");

/**
 * Query saints by keyword, feast month, or locale
 */
async function getSaints({ query, locale, feastMonth }) {
  let feastFilter = {};

  if (feastMonth) {
    // Parse year-month (e.g., "2025-10") or just month ("10")
    const now = new Date();
    const [yearStr, monthStr] = feastMonth.includes("-")
      ? feastMonth.split("-")
      : [now.getFullYear().toString(), feastMonth];

    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    if (!isNaN(year) && !isNaN(month) && month >= 1 && month <= 12) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0); // last day of the month
      feastFilter = {
        feastDate: {
          gte: start,
          lte: end,
        },
      };
    }
  }

  return prisma.saint.findMany({
    where: {
      ...feastFilter,
      ...(query && {
        locales: {
          some: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { biographyHtml: { contains: query, mode: "insensitive" } },
            ],
          },
        },
      }),
    },
    include: {
      locales: {
        where: { locale: locale || "en" },
      },
    },
    orderBy: { feastDate: "asc" },
  });
}

/**
 * Get saint by slug with localization
 */
async function getSaintBySlug(slug, locale) {
  return prisma.saint.findUnique({
    where: { slug },
    include: {
      locales: {
        where: { locale: locale || "en" },
      },
    },
  });
}

/**
 * Save a saint to user profile
 */
async function saveSaint(userId, saintId) {
  const existing = await prisma.favoriteSaint.findFirst({
    where: { userId, saintId },
  });
  if (existing) return null;

  return prisma.favoriteSaint.create({
    data: { userId, saintId },
  });
}

/**
 * Remove a saint from user profile
 */
async function removeSaint(userId, saintId) {
  const deleted = await prisma.favoriteSaint.deleteMany({
    where: { userId, saintId },
  });
  if (!deleted.count) return null;

  return true;
}

module.exports = {
  getSaints,
  getSaintBySlug,
  saveSaint,
  removeSaint,
};
