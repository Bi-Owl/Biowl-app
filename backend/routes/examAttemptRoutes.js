const express = require('express');
const router = express.Router();
const examAttemptController = require('../controllers/examAttemptController');
const authMiddleware = require('../middleware/authMiddleware'); // We will create a new middleware for exam attempts later
const examAuthMiddleware = require('../middleware/examAuthMiddleware'); // Placeholder for our new middleware

// Route to submit/update an answer for a specific question in an attempt
router.put('/:attemptId/answer', authMiddleware, examAuthMiddleware, examAttemptController.updateAnswer);

// Route to manually finish an exam attempt
router.post('/:attemptId/finish', authMiddleware, examAuthMiddleware, examAttemptController.finishAttempt);

module.exports = router;
