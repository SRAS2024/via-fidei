// server/database/db.js
const { PrismaClient } = require("@prisma/client");

let prisma;

// Prevent multiple PrismaClient instances in dev with hot reloads
if (!global.prisma) {
  global.prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });
}
prisma = global.prisma;

module.exports = prisma;
