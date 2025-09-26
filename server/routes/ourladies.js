// server/routes/ourladies.js
const express = require("express");
const prisma = require("../database/db");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET /api/ourladies
 * Query Our Lady apparitions by keyword, feast month, or locale
 */
router.get("/", async (req, res) => {
  try {
    const { query, locale, feastMonth } = req.query;

    const ourLadies = await prisma.ourLady.findMany({
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

    res.json(ourLadies);
  } catch (err) {
    console.error("Error fetching Our Ladies:", err);
    res.status(500).json({ error: "Failed to fetch Our Ladies" });
  }
});

/**
 * GET /api/ourladies/:slug
 * Get apparition by slug with localization
 */
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { locale } = req.query;

    const ourLady = await prisma.ourLady.findUnique({
      where: { slug },
      include: {
        locales: { where: { locale: locale || "en" } },
      },
    });

    if (!ourLady) {
      return res.status(404).json({ error: "Our Lady apparition not found" });
    }

    res.json(ourLady);
  } catch (err) {
    console.error("Error fetching Our Lady:", err);
    res.status(500).json({ error: "Failed to fetch Our Lady" });
  }
});

/**
 * POST /api/ourladies/:id/save
 * Save an apparition to user profile
 */
router.post("/:id/save", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await prisma.favoriteOurLady.findFirst({
      where: { userId, ourLadyId: id },
    });

    if (existing) {
      return res.status(400).json({ error: "Apparition already saved" });
    }

    const saved = await prisma.favoriteOurLady.create({
      data: { userId, ourLadyId: id },
    });

    res.json(saved);
  } catch (err) {
    console.error("Error saving Our Lady apparition:", err);
    res.status(500).json({ error: "Failed to save apparition" });
  }
});

/**
 * DELETE /api/ourladies/:id/remove
 * Remove an apparition from user profile
 */
router.delete("/:id/remove", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await prisma.favoriteOurLady.deleteMany({
      where: { userId, ourLadyId: id },
    });

    if (!deleted.count) {
      return res.status(404).json({ error: "Apparition not in profile" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error removing Our Lady apparition:", err);
    res.status(500).json({ error: "Failed to remove apparition" });
  }
});

module.exports = router;
