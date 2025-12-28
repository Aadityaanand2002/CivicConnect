const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CivicConnect Backend is Running 🚀");
});

app.use("/api/auth", authRoutes);

connectDB();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const complaintRoutes = require("./routes/complaint");
app.use("/api/complaints", complaintRoutes);

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);


