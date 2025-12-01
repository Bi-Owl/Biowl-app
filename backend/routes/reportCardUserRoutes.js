const express = require('express');
const router = express.Router();
const reportCardUserController = require('../controllers/reportCardUserController');
const { protect } = require('../middleware/authMiddleware');

// Get all available (visible) report cards for the logged-in user
router.get('/', protect, reportCardUserController.getAvailableReportCards);

// Get the detailed result for a specific report card
router.get('/:examId', protect, reportCardUserController.getReportCardDetails);

module.exports = router;
