// server/routes/milestones.js
const express = require("express");
const router = express.Router();
const milestonesController = require("../controllers/milestonesController");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

// Protect all milestone routes with authentication
router.use(authMiddleware);

// GET /api/milestones - list all milestones for the logged-in user
router.get("/", milestonesController.getAllMilestones);

// GET /api/milestones/:id - get one milestone by ID
router.get("/:id", milestonesController.getMilestoneById);

// POST /api/milestones - create a new milestone
router.post(
  "/",
  validateRequest([
    "type", // SACRAMENT | SPIRITUAL | PERSONAL
    "title",
  ]),
  milestonesController.createMilestone
);

// PUT /api/milestones/:id - update an existing milestone
router.put(
  "/:id",
  validateRequest([
    "title",
    "description",
    "iconKey",
    "status",
    "completedAt",
  ]),
  milestonesController.updateMilestone
);

// DELETE /api/milestones/:id - remove a milestone
router.delete("/:id", milestonesController.deleteMilestone);

module.exports = router;
