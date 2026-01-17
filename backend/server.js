// 🟢 1. Load Environment Variables FIRST
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// 🟢 2. Check if ENV variables are loaded
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
  process.exit(1); // Stop the server if secret is missing
}

if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env file");
  process.exit(1);
}

const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaint");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Allow Frontend
  credentials: true,
}));
app.use(express.json()); // Allow JSON data

// Test Route
app.get("/", (req, res) => {
  res.send("CivicConnect Backend is Running 🚀");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// DB & Server
const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test User Flow: http://localhost:3000`);
  });
}).catch(err => {
  console.error("Database Connection Failed:", err);
});