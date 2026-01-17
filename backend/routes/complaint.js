const express = require("express");
const Complaint = require("../models/Complaint");
const auth = require("../middleware/auth");
const multer = require("multer");
const { storage } = require("../config/cloudinary");

const router = express.Router();
const upload = multer({ storage });

/* ===============================
   CREATE COMPLAINT
================================ */
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    // 🟢 NEW: Read 'location' from the request
    const { category, description, priority, location } = req.body;

    if (!category || !description || !location) {
      return res.status(400).json({ message: "Category, Description and Location are required" });
    }

    const complaint = await Complaint.create({
      user: req.user.id,
      category,
      // 🟢 NEW: Save 'location'
      location,
      description,
      priority: priority || "Low",
      imagePath: req.file ? req.file.path : null, 
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error("Create complaint error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   GET USER COMPLAINTS
================================ */
router.get("/", auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error("Fetch complaints error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   PUBLIC TRACKING
================================ */
router.get("/track/:trackingId", async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      trackingId: req.params.trackingId,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Invalid Tracking ID" });
    }

    res.json({
      trackingId: complaint.trackingId,
      category: complaint.category,
      location: complaint.location, // 🟢 Send location to tracker too
      department: complaint.department,
      priority: complaint.priority,
      status: complaint.status,
      createdAt: complaint.createdAt,
      imagePath: complaint.imagePath || null,
    });
  } catch (err) {
    console.error("Track complaint error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;