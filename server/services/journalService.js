// server/services/journalService.js
const prisma = require("../database/db");

/**
 * Get all journal entries for a user
 */
async function getAllEntries(userId) {
  return prisma.journalEntry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get one journal entry by ID for a user
 */
async function getEntryById(userId, id) {
  return prisma.journalEntry.findFirst({
    where: { id, userId },
  });
}

/**
 * Create a new journal entry
 */
async function createEntry(userId, data) {
  return prisma.journalEntry.create({
    data: {
      userId,
      title: data.title,
      bodyMarkdown: data.bodyMarkdown,
      isSaved: data.isSaved ?? true,
      isFavorite: data.isFavorite ?? false,
    },
  });
}

/**
 * Update an existing journal entry
 */
async function updateEntry(userId, id, data) {
  const entry = await prisma.journalEntry.findFirst({ where: { id, userId } });
  if (!entry) return null;

  return prisma.journalEntry.update({
    where: { id },
    data: {
      title: data.title ?? entry.title,
      bodyMarkdown: data.bodyMarkdown ?? entry.bodyMarkdown,
      isSaved: data.isSaved ?? entry.isSaved,
      isFavorite: data.isFavorite ?? entry.isFavorite,
    },
  });
}

/**
 * Delete a journal entry
 */
async function deleteEntry(userId, id) {
  const entry = await prisma.journalEntry.findFirst({ where: { id, userId } });
  if (!entry) return null;

  await prisma.journalEntry.delete({ where: { id } });
  return true;
}

module.exports = {
  getAllEntries,
  getEntryById,
  createEntry,
  updateEntry,
  deleteEntry,
};
