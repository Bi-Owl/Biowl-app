const express = require('express');
const router = express.Router();
const { register, login, getMe, getCompletedExamsCount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/user
router.get('/user', protect, getMe);

// @route   GET /api/auth/me/completed-exams-count
router.get('/me/completed-exams-count', protect, getCompletedExamsCount);

module.exports = router;
