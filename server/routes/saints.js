// server/routes/saints.js
const express = require("express");
const prisma = require("../database/db");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET /api/saints
 * Query saints by keyword, feast month, or locale
 */
router.get("/", async (req, res) => {
  try {
    const { query, locale, feastMonth } = req.query;

    let feastFilter = {};
    if (feastMonth) {
      // Parse year-month (e.g. "2025-10") or just month ("10")
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

    const saints = await prisma.saint.findMany({
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

    res.json(saints);
  } catch (err) {
    console.error("Error fetching saints:", err);
    res.status(500).json({ error: "Failed to fetch saints" });
  }
});

/**
 * GET /api/saints/:slug
 * Get saint by slug with localization
 */
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { locale } = req.query;

    const saint = await prisma.saint.findUnique({
      where: { slug },
      include: {
        locales: {
          where: { locale: locale || "en" },
        },
      },
    });

    if (!saint) {
      return res.status(404).json({ error: "Saint not found" });
    }

    res.json(saint);
  } catch (err) {
    console.error("Error fetching saint:", err);
    res.status(500).json({ error: "Failed to fetch saint" });
  }
});

/**
 * POST /api/saints/:id/save
 * Save a saint to user profile
 */
router.post("/:id/save", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await prisma.favoriteSaint.findFirst({
      where: { userId, saintId: id },
    });

    if (existing) {
      return res.status(400).json({ error: "Saint already saved" });
    }

    const saved = await prisma.favoriteSaint.create({
      data: { userId, saintId: id },
    });

    res.json(saved);
  } catch (err) {
    console.error("Error saving saint:", err);
    res.status(500).json({ error: "Failed to save saint" });
  }
});

/**
 * DELETE /api/saints/:id/remove
 * Remove a saint from user profile
 */
router.delete("/:id/remove", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await prisma.favoriteSaint.deleteMany({
      where: { userId, saintId: id },
    });

    if (!deleted.count) {
      return res.status(404).json({ error: "Saint not in profile" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error removing saint:", err);
    res.status(500).json({ error: "Failed to remove saint" });
  }
});

module.exports = router;
