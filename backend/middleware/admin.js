const User = require("../models/User");

module.exports = async function (req, res, next) {
  const user = await User.findById(req.user);

  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin access denied" });
  }

  next();
};
