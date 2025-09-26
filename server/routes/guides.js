// server/routes/guides.js
const express = require("express");
const prisma = require("../database/db");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET /api/guides/:slug
 * Get a single guide with localized content and steps
 */
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { locale } = req.query;

    const guide = await prisma.guide.findUnique({
      where: { slug },
      include: {
        locales: { where: { locale: locale || "en" } },
        steps: {
          include: {
            locales: { where: { locale: locale || "en" } },
          },
        },
      },
    });

    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }

    res.json(guide);
  } catch (err) {
    console.error("Error fetching guide:", err);
    res.status(500).json({ error: "Failed to fetch guide" });
  }
});

/**
 * POST /api/guides/:id/save
 * Save a guide to user profile as a favorite
 */
router.post("/:id/save", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await prisma.favorite.findFirst({
      where: { userId, entityType: "guide", entityId: id },
    });

    if (existing) {
      return res.status(400).json({ error: "Guide already saved" });
    }

    const saved = await prisma.favorite.create({
      data: {
        userId,
        entityType: "guide",
        entityId: id,
      },
    });

    res.json(saved);
  } catch (err) {
    console.error("Error saving guide:", err);
    res.status(500).json({ error: "Failed to save guide" });
  }
});

/**
 * POST /api/guides/:id/add-goal
 * Turn a guide into a structured goal with daily checklist
 */
router.post("/:id/add-goal", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const guide = await prisma.guide.findUnique({
      where: { id },
      include: { steps: true },
    });

    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }

    // Create a goal from guide steps
    const goal = await prisma.goal.create({
      data: {
        userId,
        title: guide.slug,
        description: "Checklist created from guide",
        type: "template",
        templateId: guide.id,
        status: "in_progress",
        days: {
          create: guide.steps.map((step, i) => ({
            dayNumber: i + 1,
            checklistJson: step.checklistJson || [],
          })),
        },
      },
      include: { days: true },
    });

    res.json(goal);
  } catch (err) {
    console.error("Error creating goal from guide:", err);
    res.status(500).json({ error: "Failed to create goal" });
  }
});

module.exports = router;
