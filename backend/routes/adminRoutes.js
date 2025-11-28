const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

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

module.exports = router;
