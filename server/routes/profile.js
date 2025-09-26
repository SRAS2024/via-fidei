// server/routes/profile.js
const express = require("express");
const prisma = require("../database/db");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET /api/profile
 * Get current user's profile basics
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        locale: true,
        theme: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

/**
 * GET /api/profile/prayers
 */
router.get("/prayers", requireAuth, async (req, res) => {
  try {
    const prayers = await prisma.favoritePrayer.findMany({
      where: { userId: req.user.id },
      include: {
        prayer: {
          include: {
            locales: { where: { locale: req.user.locale || "en" } },
          },
        },
      },
    });
    res.json(prayers);
  } catch (err) {
    console.error("Error fetching profile prayers:", err);
    res.status(500).json({ error: "Failed to fetch prayers" });
  }
});

/**
 * GET /api/profile/saints
 */
router.get("/saints", requireAuth, async (req, res) => {
  try {
    const saints = await prisma.favoriteSaint.findMany({
      where: { userId: req.user.id },
      include: {
        saint: {
          include: {
            locales: { where: { locale: req.user.locale || "en" } },
          },
        },
      },
    });
    res.json(saints);
  } catch (err) {
    console.error("Error fetching profile saints:", err);
    res.status(500).json({ error: "Failed to fetch saints" });
  }
});

/**
 * GET /api/profile/ourladies
 */
router.get("/ourladies", requireAuth, async (req, res) => {
  try {
    const ourLadies = await prisma.favoriteOurLady.findMany({
      where: { userId: req.user.id },
      include: {
        ourLady: {
          include: {
            locales: { where: { locale: req.user.locale || "en" } },
          },
        },
      },
    });
    res.json(ourLadies);
  } catch (err) {
    console.error("Error fetching profile our ladies:", err);
    res.status(500).json({ error: "Failed to fetch Our Ladies" });
  }
});

/**
 * Journal CRUD
 */
router.get("/journal", requireAuth, async (req, res) => {
  const entries = await prisma.journalEntry.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(entries);
});

router.post("/journal", requireAuth, async (req, res) => {
  const { title, body } = req.body;
  const entry = await prisma.journalEntry.create({
    data: {
      userId: req.user.id,
      title,
      bodyMarkdown: body,
    },
  });
  res.json(entry);
});

router.patch("/journal/:id", requireAuth, async (req, res) => {
  const { title, body } = req.body;
  const entry = await prisma.journalEntry.update({
    where: { id: req.params.id },
    data: { title, bodyMarkdown: body },
  });
  res.json(entry);
});

router.delete("/journal/:id", requireAuth, async (req, res) => {
  await prisma.journalEntry.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

/**
 * Milestones
 */
router.get("/milestones", requireAuth, async (req, res) => {
  const milestones = await prisma.milestone.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(milestones);
});

router.post("/milestones", requireAuth, async (req, res) => {
  const { type, title, description, iconKey } = req.body;
  const milestone = await prisma.milestone.create({
    data: {
      userId: req.user.id,
      type,
      title,
      description,
      iconKey,
      status: "planned",
    },
  });
  res.json(milestone);
});

router.patch("/milestones/:id", requireAuth, async (req, res) => {
  const { status, completedAt } = req.body;
  const milestone = await prisma.milestone.update({
    where: { id: req.params.id },
    data: { status, completedAt },
  });
  res.json(milestone);
});

router.delete("/milestones/:id", requireAuth, async (req, res) => {
  await prisma.milestone.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

/**
 * Goals
 */
router.get("/goals", requireAuth, async (req, res) => {
  const goals = await prisma.goal.findMany({
    where: { userId: req.user.id },
    include: { days: true },
  });
  res.json(goals);
});

router.post("/goals", requireAuth, async (req, res) => {
  const { title, description, days } = req.body;
  const goal = await prisma.goal.create({
    data: {
      userId: req.user.id,
      title,
      description,
      type: "generic",
      status: "in_progress",
      days: {
        create: days.map((day, i) => ({
          dayNumber: i + 1,
          checklistJson: day.checklist || [],
        })),
      },
    },
    include: { days: true },
  });
  res.json(goal);
});

router.patch("/goals/:id", requireAuth, async (req, res) => {
  const { title, description, status } = req.body;
  const goal = await prisma.goal.update({
    where: { id: req.params.id },
    data: { title, description, status },
  });
  res.json(goal);
});

router.post("/goals/:id/days/:dayNumber/toggle", requireAuth, async (req, res) => {
  const { id, dayNumber } = req.params;

  const day = await prisma.goalDay.findFirst({
    where: { goalId: id, dayNumber: parseInt(dayNumber) },
  });

  if (!day) {
    return res.status(404).json({ error: "Goal day not found" });
  }

  const updated = await prisma.goalDay.update({
    where: { id: day.id },
    data: {
      isCompleted: !day.isCompleted,
      completedAt: !day.isCompleted ? new Date() : null,
    },
  });

  res.json(updated);
});

router.delete("/goals/:id", requireAuth, async (req, res) => {
  await prisma.goal.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

module.exports = router;
