const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 🟢 NEW: Check if user exists (Step 1 of Zomato Flow)
exports.checkUser = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (user) {
      // User found -> Send "true" and their name
      res.json({ exists: true, name: user.name }); 
    } else {
      // User not found -> Send "false" (Frontend will show Signup)
      res.json({ exists: false }); 
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Register New User
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password });
  
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.isAdmin ? "admin" : "citizen", // reliable role check
      token: generateToken(user.id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// @desc    Login Existing User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.isAdmin ? "admin" : "citizen",
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ message: "Invalid password" });
  }
};