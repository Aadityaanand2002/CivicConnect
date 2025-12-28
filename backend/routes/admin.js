const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const auth = require("../middleware/auth");

// Get all complaints (ADMIN)
router.get("/complaints", auth, async (req, res) => {
  const complaints = await Complaint.find().populate("user", "name email");
  res.json(complaints);
});

// Update status (ADMIN)
router.put("/complaints/:id", auth, async (req, res) => {
  const { status } = req.body;
  const updated = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.json(updated);
});

module.exports = router;
