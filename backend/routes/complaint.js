const express = require("express");
const Complaint = require("../models/Complaint");
const auth = require("../middleware/auth");

const router = express.Router();

/* CREATE COMPLAINT */
router.post("/", auth, async (req, res) => {
  try {
    const { category, description } = req.body;

    const complaint = await Complaint.create({
      user: req.user,
      category,
      description
    });

    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* GET USER COMPLAINTS */
router.get("/", auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
