const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Import your route modules
const authRoutes = require("./routes/auth");
const prayersRoutes = require("./routes/prayers");
const guidesRoutes = require("./routes/guides");
const ourLadiesRoutes = require("./routes/ourladies");
const saintsRoutes = require("./routes/saints");
const parishesRoutes = require("./routes/parishes");
const profileRoutes = require("./routes/profile");
const milestonesRoutes = require("./routes/milestones");
const goalsRoutes = require("./routes/goals");
const journalRoutes = require("./routes/journal");
const searchRoutes = require("./routes/search");

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/prayers", prayersRoutes);
app.use("/api/guides", guidesRoutes);
app.use("/api/ourladies", ourLadiesRoutes);
app.use("/api/saints", saintsRoutes);
app.use("/api/parishes", parishesRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/milestones", milestonesRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/search", searchRoutes);

// Serve React client build in production
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "..", "client", "build");
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// Fallback 404 for API only (not React routes)
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
