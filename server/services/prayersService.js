// server/services/prayersService.js
const prisma = require("../database/db");

/**
 * Query prayers by keyword, category, or locale
 */
async function getPrayers({ query, locale, category }) {
  return prisma.prayer.findMany({
    where: {
      ...(category && { categoryId: category }),
      ...(query && {
        locales: {
          some: {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { bodyHtml: { contains: query, mode: "insensitive" } },
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
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Get prayer by slug with localization
 */
async function getPrayerBySlug(slug, locale) {
  return prisma.prayer.findUnique({
    where: { slug },
    include: {
      locales: {
        where: { locale: locale || "en" },
      },
    },
  });
}

/**
 * Save a prayer to user profile
 */
async function savePrayer(userId, prayerId) {
  const existing = await prisma.favoritePrayer.findFirst({
    where: { userId, prayerId },
  });
  if (existing) return null;

  return prisma.favoritePrayer.create({
    data: { userId, prayerId },
  });
}

/**
 * Remove a prayer from user profile
 */
async function removePrayer(userId, prayerId) {
  const deleted = await prisma.favoritePrayer.deleteMany({
    where: { userId, prayerId },
  });
  if (!deleted.count) return null;

  return true;
}

module.exports = {
  getPrayers,
  getPrayerBySlug,
  savePrayer,
  removePrayer,
};
