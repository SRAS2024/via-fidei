// server/server.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true, // restrict to frontend URL in production
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());

// Routes
const authRoutes = require("./routes/auth");
const prayerRoutes = require("./routes/prayers");
const saintRoutes = require("./routes/saints");
const ourLadyRoutes = require("./routes/ourladies"); // NEW
const guideRoutes = require("./routes/guides");
const parishRoutes = require("./routes/parishes");
const profileRoutes = require("./routes/profile");
const searchRoutes = require("./routes/search");

app.use("/api/auth", authRoutes);
app.use("/api/prayers", prayerRoutes);
app.use("/api/saints", saintRoutes);
app.use("/api/ourladies", ourLadyRoutes); // NEW
app.use("/api/guides", guideRoutes);
app.use("/api/parishes", parishRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/search", searchRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Catch-all 404 for unrecognized routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
