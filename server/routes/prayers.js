// server/routes/prayers.js
const express = require("express");
const prisma = require("../database/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET /api/prayers
 * Query prayers by keyword, category, or locale
 */
router.get("/", async (req, res) => {
  try {
    const { query, locale, category } = req.query;

    const prayers = await prisma.prayer.findMany({
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

    res.json(prayers);
  } catch (err) {
    console.error("Error fetching prayers:", err);
    res.status(500).json({ error: "Failed to fetch prayers" });
  }
});

/**
 * GET /api/prayers/:slug
 * Get prayer by slug with localization
 */
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { locale } = req.query;

    const prayer = await prisma.prayer.findUnique({
      where: { slug },
      include: {
        locales: {
          where: { locale: locale || "en" },
        },
      },
    });

    if (!prayer) {
      return res.status(404).json({ error: "Prayer not found" });
    }

    res.json(prayer);
  } catch (err) {
    console.error("Error fetching prayer:", err);
    res.status(500).json({ error: "Failed to fetch prayer" });
  }
});

/**
 * POST /api/prayers/:id/save
 * Save a prayer to user profile
 */
router.post("/:id/save", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await prisma.favoritePrayer.findFirst({
      where: { userId, prayerId: id },
    });

    if (existing) {
      return res.status(400).json({ error: "Prayer already saved" });
    }

    const saved = await prisma.favoritePrayer.create({
      data: { userId, prayerId: id },
    });

    res.json(saved);
  } catch (err) {
    console.error("Error saving prayer:", err);
    res.status(500).json({ error: "Failed to save prayer" });
  }
});

/**
 * DELETE /api/prayers/:id/remove
 * Remove a prayer from user profile
 */
router.delete("/:id/remove", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await prisma.favoritePrayer.deleteMany({
      where: { userId, prayerId: id },
    });

    if (!deleted.count) {
      return res.status(404).json({ error: "Prayer not in profile" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error removing prayer:", err);
    res.status(500).json({ error: "Failed to remove prayer" });
  }
});

module.exports = router;
