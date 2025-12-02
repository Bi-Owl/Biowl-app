const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const { uploadQuestionImage, uploadAnswerKeyPdf } = require('../middleware/uploadMiddleware');

router.post('/login', adminController.login);

// User management routes
router.get('/users', adminAuthMiddleware, adminController.getUsers);
router.get('/users/:id', adminAuthMiddleware, adminController.getUserById);
router.put('/users/:id', adminAuthMiddleware, adminController.updateUser);
router.delete('/users/:id', adminAuthMiddleware, adminController.deleteUser);

// Exam management routes
router.post('/exams', adminAuthMiddleware, adminController.createExam);
router.get('/exams', adminAuthMiddleware, adminController.getAllExams);
router.get('/exams/:id', adminAuthMiddleware, adminController.getExamById);
router.put('/exams/:id', adminAuthMiddleware, adminController.updateExam);
router.delete('/exams/:id', adminAuthMiddleware, adminController.deleteExam);

// Question management routes
router.post('/questions/reorder', adminAuthMiddleware, adminController.reorderQuestions);
router.get('/exams/:examId/questions', adminAuthMiddleware, adminController.getQuestionsForExam);
router.post('/exams/:examId/questions', [adminAuthMiddleware, uploadQuestionImage], adminController.createQuestion);
router.put('/questions/:questionId', [adminAuthMiddleware, uploadQuestionImage], adminController.updateQuestion);
router.delete('/questions/:questionId', adminAuthMiddleware, adminController.deleteQuestion);

// Explanation management routes
router.get('/exams/:examId/explanations', adminAuthMiddleware, adminController.getExplanationsForExam);
router.post('/exams/:examId/explanations', [adminAuthMiddleware, uploadQuestionImage], adminController.createExplanation);
router.put('/explanations/:explanationId', [adminAuthMiddleware, uploadQuestionImage], adminController.updateExplanation);
router.delete('/explanations/:explanationId', adminAuthMiddleware, adminController.deleteExplanation);

// Report Card (Karnameh) management routes
router.get('/report-cards/exams', adminAuthMiddleware, adminController.getExamsWithReportCardStatus);
router.post('/report-cards/publish/:examId', [adminAuthMiddleware, uploadAnswerKeyPdf], adminController.publishReportCard);
router.put('/report-cards/:examId', [adminAuthMiddleware, uploadAnswerKeyPdf], adminController.updateReportCard);

module.exports = router;
