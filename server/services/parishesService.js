// server/services/parishesService.js
const prisma = require("../database/db");

/**
 * Search for parishes by coordinates, city, or postal code
 * (Geo filtering with PostGIS can be added later)
 */
async function getParishes({ lat, lng, city, postal, country }) {
  let where = {};

  if (lat && lng) {
    // TODO: Add PostGIS geo distance filtering later
    where = { ...(country && { country }) };
  } else if (city || postal) {
    where = {
      ...(city && { city: { contains: city, mode: "insensitive" } }),
      ...(postal && { postalCode: { contains: postal } }),
      ...(country && { country }),
    };
  }

  return prisma.parish.findMany({
    where,
    take: 50,
    orderBy: { name: "asc" },
  });
}

/**
 * Get parish details by ID
 */
async function getParishById(parishId) {
  return prisma.parish.findUnique({
    where: { id: parishId },
  });
}

/**
 * Save parish to profile
 */
async function saveParish(userId, parishId) {
  const existing = await prisma.favorite.findFirst({
    where: { userId, entityType: "parish", entityId: parishId },
  });
  if (existing) return null;

  return prisma.favorite.create({
    data: {
      userId,
      entityType: "parish",
      entityId: parishId,
    },
  });
}

/**
 * Remove parish from profile
 */
async function removeParish(userId, parishId) {
  const deleted = await prisma.favorite.deleteMany({
    where: { userId, entityType: "parish", entityId: parishId },
  });
  if (!deleted.count) return null;

  return true;
}

module.exports = {
  getParishes,
  getParishById,
  saveParish,
  removeParish,
};
