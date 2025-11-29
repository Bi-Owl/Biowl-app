const express = require('express');
const router = express.Router();
const { getPublicExams, getExamStatusForUser, purchaseExam, getPurchasedExams } = require('../controllers/examController');
const { startAttempt } = require('../controllers/examAttemptController');
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

// @route   POST /api/exams/:examId/start
// @desc    Start an exam attempt
router.post('/:examId/start', protect, startAttempt);

module.exports = router;
