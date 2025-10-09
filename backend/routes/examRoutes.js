const express = require('express');
const router = express.Router();
const { getPublicExams, getExamStatusForUser } = require('../controllers/examController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/exams
// @desc    Get all public exams
router.get('/', getPublicExams);

// @route   GET /api/exams/:examId/status
// @desc    Get purchase status for a specific exam
router.get('/:examId/status', protect, getExamStatusForUser);

module.exports = router;
