const express = require('express');
const router = express.Router();
const { signup, login, checkUser } = require('../controllers/authController');

router.post('/check-user', checkUser); // 🟢 The Smart Check
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;