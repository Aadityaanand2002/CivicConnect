const express = require("express");
const Complaint = require("../models/Complaint");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

/* GET ALL COMPLAINTS */
router.get("/complaints", auth, admin, async (req, res) => {
  const complaints = await Complaint.find().populate("user", "name email");
  res.json(complaints);
});

/* UPDATE STATUS */
router.put("/complaints/:id", auth, admin, async (req, res) => {
  const { status } = req.body;

  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(complaint);
});

module.exports = router;
