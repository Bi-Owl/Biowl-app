const express = require('express');
const router = express.Router();
const examAttemptController = require('../controllers/examAttemptController');
const { protect } = require('../middleware/authMiddleware');
const examAuthMiddleware = require('../middleware/examAuthMiddleware');

// Route to get a completed attempt for review
router.get('/:attemptId/review', protect, examAttemptController.reviewAttempt);

// Route to submit/update an answer for a specific question in an attempt
router.put('/:attemptId/answer', protect, examAuthMiddleware, examAttemptController.updateAnswer);

// Route to manually finish an exam attempt
router.post('/:attemptId/finish', protect, examAuthMiddleware, examAttemptController.finishAttempt);

module.exports = router;

