 express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

/**
 * Basic middleware
 */
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

/**
 * Health check
 */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * Helper to mount a route only if the file exists
 */
function mountIfExists(mountPoint, relPathFromServer) {
  const base = path.join(__dirname, relPathFromServer);
  const candidates = [`${base}.js`, path.join(base, "index.js")];
  const exists = candidates.some(p => fs.existsSync(p));
  if (exists) {
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const router = require(base);
      app.use(mountPoint, router);
      // Optional console to help diagnose missing routes during deploy
      console.log(`[routes] Mounted ${mountPoint} from ${base}`);
    } catch (e) {
      console.error(`[routes] Failed to mount ${mountPoint} from ${base}`, e);
    }
  } else {
    console.warn(
      `[routes] Skipped ${mountPoint}. File not found at ${base}.js or ${base}/index.js`
    );
  }
}

/**
 * API routes
 * These will mount only if the corresponding files exist under server/routes
 */
mountIfExists("/api/auth", "./routes/auth");
mountIfExists("/api/prayers", "./routes/prayers");
mountIfExists("/api/guides", "./routes/guides");
mountIfExists("/api/ourladies", "./routes/ourladies");
mountIfExists("/api/saints", "./routes/saints");
mountIfExists("/api/parishes", "./routes/parishes");
mountIfExists("/api/profile", "./routes/profile");
mountIfExists("/api/milestones", "./routes/milestones");
mountIfExists("/api/goals", "./routes/goals");
mountIfExists("/api/journal", "./routes/journal");
mountIfExists("/api/search", "./routes/search");

/**
 * Serve React build in production
 */
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "..", "client", "build");
  app.use(express.static(clientBuildPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

/**
 * 404 handler for API
 */
app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

/**
 * Error handler
 */
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
