// server/controllers/profileController.js
const profileService = require("../services/profileService");

/**
 * Profile basics
 */
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

/**
 * Favorites
 */
exports.getProfilePrayers = async (req, res, next) => {
  try {
    const prayers = await profileService.getProfilePrayers(
      req.user.id,
      req.user.locale
    );
    res.json(prayers);
  } catch (err) {
    next(err);
  }
};

exports.getProfileSaints = async (req, res, next) => {
  try {
    const saints = await profileService.getProfileSaints(
      req.user.id,
      req.user.locale
    );
    res.json(saints);
  } catch (err) {
    next(err);
  }
};

exports.getProfileOurLadies = async (req, res, next) => {
  try {
    const ourLadies = await profileService.getProfileOurLadies(
      req.user.id,
      req.user.locale
    );
    res.json(ourLadies);
  } catch (err) {
    next(err);
  }
};

/**
 * Journal
 */
exports.getJournalEntries = async (req, res, next) => {
  try {
    const entries = await profileService.getJournalEntries(req.user.id);
    res.json(entries);
  } catch (err) {
    next(err);
  }
};

exports.createJournalEntry = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const entry = await profileService.createJournalEntry(
      req.user.id,
      title,
      body
    );
    res.json(entry);
  } catch (err) {
    next(err);
  }
};

exports.updateJournalEntry = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const entry = await profileService.updateJournalEntry(
      req.params.id,
      title,
      body
    );
    res.json(entry);
  } catch (err) {
    next(err);
  }
};

exports.deleteJournalEntry = async (req, res, next) => {
  try {
    await profileService.deleteJournalEntry(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

/**
 * Milestones
 */
exports.getMilestones = async (req, res, next) => {
  try {
    const milestones = await profileService.getMilestones(req.user.id);
    res.json(milestones);
  } catch (err) {
    next(err);
  }
};

exports.createMilestone = async (req, res, next) => {
  try {
    const { type, title, description, iconKey } = req.body;
    const milestone = await profileService.createMilestone(
      req.user.id,
      type,
      title,
      description,
      iconKey
    );
    res.json(milestone);
  } catch (err) {
    next(err);
  }
};

exports.updateMilestone = async (req, res, next) => {
  try {
    const { status, completedAt } = req.body;
    const milestone = await profileService.updateMilestone(
      req.params.id,
      status,
      completedAt
    );
    res.json(milestone);
  } catch (err) {
    next(err);
  }
};

exports.deleteMilestone = async (req, res, next) => {
  try {
    await profileService.deleteMilestone(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

/**
 * Goals
 */
exports.getGoals = async (req, res, next) => {
  try {
    const goals = await profileService.getGoals(req.user.id);
    res.json(goals);
  } catch (err) {
    next(err);
  }
};

exports.createGoal = async (req, res, next) => {
  try {
    const { title, description, days } = req.body;
    const goal = await profileService.createGoal(
      req.user.id,
      title,
      description,
      days
    );
    res.json(goal);
  } catch (err) {
    next(err);
  }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const goal = await profileService.updateGoal(
      req.params.id,
      title,
      description,
      status
    );
    res.json(goal);
  } catch (err) {
    next(err);
  }
};

exports.toggleGoalDay = async (req, res, next) => {
  try {
    const { id, dayNumber } = req.params;
    const updatedDay = await profileService.toggleGoalDay(
      id,
      parseInt(dayNumber)
    );
    if (!updatedDay) {
      return res.status(404).json({ error: "Goal day not found" });
    }
    res.json(updatedDay);
  } catch (err) {
    next(err);
  }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    await profileService.deleteGoal(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
