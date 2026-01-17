const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const adminAuth = require("../middleware/adminAuth"); 

// GET ALL COMPLAINTS (Sorted by Newest)
router.get("/complaints", adminAuth, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error("Admin Fetch Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE STATUS
router.put("/complaints/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    await Complaint.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;