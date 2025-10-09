const express = require('express');
const router = express.Router();
const { getPublicExams, getExamStatusForUser, purchaseExam, getPurchasedExams } = require('../controllers/examController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/exams
// @desc    Get all public exams
router.get('/', getPublicExams);

// @route   GET /api/exams/purchased
// @desc    Get all exams purchased by the user
router.get('/purchased', protect, getPurchasedExams);

// @route   POST /api/exams/:examId/purchase
// @desc    Purchase an exam
router.post('/:examId/purchase', protect, purchaseExam);

// @route   GET /api/exams/:examId/status
// @desc    Get purchase status for a specific exam
router.get('/:examId/status', protect, getExamStatusForUser);

module.exports = router;
