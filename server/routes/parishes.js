// server/routes/parishes.js
const express = require("express");
const prisma = require("../database/db");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET /api/parishes
 * Search for parishes by coordinates, city, or postal code
 */
router.get("/", async (req, res) => {
  try {
    const { lat, lng, city, postal, country } = req.query;

    let where = {};

    if (lat && lng) {
      // TODO: Add PostGIS geo distance filtering later
      where = { country: country || undefined };
    } else if (city || postal) {
      where = {
        ...(city && { city: { contains: city, mode: "insensitive" } }),
        ...(postal && { postalCode: { contains: postal } }),
        ...(country && { country }),
      };
    }

    const parishes = await prisma.parish.findMany({
      where,
      take: 50,
      orderBy: { name: "asc" },
    });

    res.json(parishes);
  } catch (err) {
    console.error("Error fetching parishes:", err);
    res.status(500).json({ error: "Failed to fetch parishes" });
  }
});

/**
 * GET /api/parishes/:id
 * Get parish details by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const parish = await prisma.parish.findUnique({
      where: { id: req.params.id },
    });

    if (!parish) {
      return res.status(404).json({ error: "Parish not found" });
    }

    res.json(parish);
  } catch (err) {
    console.error("Error fetching parish:", err);
    res.status(500).json({ error: "Failed to fetch parish" });
  }
});

/**
 * POST /api/parishes/:id/save
 * Save parish to profile
 */
router.post("/:id/save", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await prisma.favorite.findFirst({
      where: { userId, entityType: "parish", entityId: id },
    });

    if (existing) {
      return res.status(400).json({ error: "Parish already saved" });
    }

    const saved = await prisma.favorite.create({
      data: {
        userId,
        entityType: "parish",
        entityId: id,
      },
    });

    res.json(saved);
  } catch (err) {
    console.error("Error saving parish:", err);
    res.status(500).json({ error: "Failed to save parish" });
  }
});

/**
 * DELETE /api/parishes/:id/remove
 * Remove parish from profile
 */
router.delete("/:id/remove", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await prisma.favorite.deleteMany({
      where: { userId, entityType: "parish", entityId: id },
    });

    if (!deleted.count) {
      return res.status(404).json({ error: "Parish not in profile" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error removing parish:", err);
    res.status(500).json({ error: "Failed to remove parish" });
  }
});

module.exports = router;
