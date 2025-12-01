const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const upload = require('../middleware/uploadMiddleware');

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
router.post('/exams/:examId/questions', [adminAuthMiddleware, upload], adminController.createQuestion);
router.put('/questions/:questionId', [adminAuthMiddleware, upload], adminController.updateQuestion);
router.delete('/questions/:questionId', adminAuthMiddleware, adminController.deleteQuestion);

// Report Card (Karnameh) management routes
router.get('/report-cards/exams', adminAuthMiddleware, adminController.getExamsWithReportCardStatus);
router.post('/report-cards/publish/:examId', [adminAuthMiddleware, upload.single('answerKeyPdf')], adminController.publishReportCard);
router.put('/report-cards/:examId', [adminAuthMiddleware, upload.single('answerKeyPdf')], adminController.updateReportCard);

module.exports = router;
