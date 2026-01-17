const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trackingId: {
      type: String,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
    },
    // 🟢 NEW: Store the Address/Location
    location: {
      type: String,
      required: true, 
    },
    description: {
      type: String,
      required: true,
    },
    department: {
      type: String,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    imagePath: {
      type: String, 
      default: null 
    }
  },
  {
    timestamps: true,
  }
);

complaintSchema.pre("save", async function () {
  if (!this.trackingId) {
    this.trackingId = "CC-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
  }

  const departmentMap = {
    "Street Light": "Electricity Dept",
    "Water Logging": "Water Supply Dept",
    "Sewage": "Sanitation Dept",
    "Garbage": "Municipal Corporation",
    "Road Damage": "Public Works Dept (PWD)",
    "Other": "General Admin"
  };

  if (!this.department && this.category) {
    this.department = departmentMap[this.category] || "General Admin";
  }
});

module.exports = mongoose.model("Complaint", complaintSchema);