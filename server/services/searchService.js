// server/services/searchService.js
const prisma = require("../database/db");

/**
 * Perform a global search across prayers, saints, Our Lady apparitions, guides, and parishes
 */
async function globalSearch(searchTerm, type, locale) {
  let results = [];

  // --- Search Prayers ---
  if (!type || type === "prayer") {
    const prayers = await prisma.prayer.findMany({
      where: {
        locales: {
          some: {
            OR: [
              { title: { contains: searchTerm, mode: "insensitive" } },
              { bodyHtml: { contains: searchTerm, mode: "insensitive" } },
            ],
            ...(locale && { locale }),
          },
        },
      },
      include: { locales: { where: { locale: locale || "en" } } },
      take: 10,
    });
    results.push(...prayers.map((p) => ({ type: "prayer", ...p })));
  }

  // --- Search Saints ---
  if (!type || type === "saint") {
    const saints = await prisma.saint.findMany({
      where: {
        locales: {
          some: {
            OR: [
              { name: { contains: searchTerm, mode: "insensitive" } },
              { biographyHtml: { contains: searchTerm, mode: "insensitive" } },
            ],
            ...(locale && { locale }),
          },
        },
      },
      include: { locales: { where: { locale: locale || "en" } } },
      take: 10,
    });
    results.push(...saints.map((s) => ({ type: "saint", ...s })));
  }

  // --- Search Our Ladies ---
  if (!type || type === "ourlady") {
    const ourLadies = await prisma.ourLady.findMany({
      where: {
        locales: {
          some: {
            OR: [
              { name: { contains: searchTerm, mode: "insensitive" } },
              { biographyHtml: { contains: searchTerm, mode: "insensitive" } },
            ],
            ...(locale && { locale }),
          },
        },
      },
      include: { locales: { where: { locale: locale || "en" } } },
      take: 10,
    });
    results.push(...ourLadies.map((o) => ({ type: "ourlady", ...o })));
  }

  // --- Search Guides ---
  if (!type || type === "guide") {
    const guides = await prisma.guide.findMany({
      where: {
        locales: {
          some: {
            OR: [
              { title: { contains: searchTerm, mode: "insensitive" } },
              { introHtml: { contains: searchTerm, mode: "insensitive" } },
            ],
            ...(locale && { locale }),
          },
        },
      },
      include: { locales: { where: { locale: locale || "en" } } },
      take: 10,
    });
    results.push(...guides.map((g) => ({ type: "guide", ...g })));
  }

  // --- Search Parishes ---
  if (!type || type === "parish") {
    const parishes = await prisma.parish.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { city: { contains: searchTerm, mode: "insensitive" } },
          { region: { contains: searchTerm, mode: "insensitive" } },
          { country: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: 10,
    });
    results.push(...parishes.map((p) => ({ type: "parish", ...p })));
  }

  // --- Sort results by type then title/name ---
  results.sort((a, b) => {
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    const aTitle = a.locales?.[0]?.title || a.locales?.[0]?.name || a.name || "";
    const bTitle = b.locales?.[0]?.title || b.locales?.[0]?.name || b.name || "";
    return aTitle.localeCompare(bTitle);
  });

  return results;
}

module.exports = {
  globalSearch,
};
