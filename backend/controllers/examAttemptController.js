const jwt = require('jsonwebtoken');
const Exam = require('../models/exam');
const UserExam = require('../models/userExam');
const UserExamAttempt = require('../models/userExamAttempt');
const Question = require('../models/question');

// @desc    Start or resume an exam attempt
// @route   POST /api/exams/:examId/start
// @access  Private
const startAttempt = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id;

    // 1. Check if user has purchased the exam
    const userExam = await UserExam.findOne({ where: { UserId: userId, ExamId: examId } });
    if (!userExam) {
      return res.status(403).json({ message: 'You have not purchased this exam.' });
    }

    // 2. Get Exam details
    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found.' });
    }

    // 3. Check if exam is within the available time window
    const now = new Date();
    if (now < new Date(exam.startTime) || now > new Date(exam.endTime)) {
      return res.status(403).json({ message: 'This exam is not currently active.' });
    }

    // 4. Find or create an attempt
    let attempt = await UserExamAttempt.findOne({ where: { UserId: userId, ExamId: examId } });

    if (attempt) {
      // If attempt is already completed, deny access
      if (attempt.status === 'completed') {
        return res.status(403).json({ message: 'You have already completed this exam.' });
      }
    } else {
      // If no attempt exists, create one
      attempt = await UserExamAttempt.create({
        UserId: userId,
        ExamId: examId,
        startedAt: new Date(),
        status: 'in_progress',
        answers: {}, // Initialize with empty answers
      });
    }

    // 5. Calculate remaining time
    const timeElapsed = now.getTime() - new Date(attempt.startedAt).getTime(); // in milliseconds
    const remainingTime = (exam.duration * 60 * 1000) - timeElapsed;

    if (remainingTime <= 0) {
      attempt.status = 'completed';
      attempt.finishedAt = new Date();
      await attempt.save();
      return res.status(403).json({ message: 'Your time for this exam has expired.' });
    }
    
    // 6. Generate a short-lived JWT for this specific attempt
    const examToken = jwt.sign(
      { attemptId: attempt.id, userId: userId },
      process.env.JWT_SECRET,
      { expiresIn: Math.ceil(remainingTime / 1000) } // expiresIn is in seconds
    );

    // 7. Fetch questions without answers
    const questions = await Question.findAll({ 
        where: { ExamId: examId },
        attributes: { exclude: ['correctOption'] }
    });

    res.json({
      message: 'Exam started successfully.',
      attempt: {
        id: attempt.id,
        startedAt: attempt.startedAt,
        status: attempt.status,
        answers: attempt.answers,
      },
      questions,
      remainingTime, // in milliseconds
      examToken,
    });

  } catch (error) {
    console.error('Error starting exam attempt:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update an answer for a question in an attempt
// @route   PUT /api/attempts/:attemptId/answer
// @access  Private (with exam token)
const updateAnswer = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const { questionId, answer } = req.body;

        // The examAuthMiddleware will validate the token and ensure the attempt belongs to the user.
        // We retrieve the attempt from the request object, which is attached by the middleware.
        const attempt = req.attempt;

        // 1. Double-check if the attempt is still in progress
        if (attempt.status === 'completed') {
            return res.status(403).json({ message: 'This exam has already been completed.' });
        }

        // 2. Validate questionId and answer if necessary (e.g., ensure question belongs to the exam)
        // For now, we'll trust the client is sending valid data for simplicity.

        // 3. Update the answers JSON object
        // The 'answers' field is a JSON field, so we can directly manipulate it.
        const updatedAnswers = {
            ...attempt.answers,
            [questionId]: answer, // Add or update the answer for the given questionId
        };
        
        attempt.answers = updatedAnswers;

        // 4. Save the updated attempt
        await attempt.save();

        res.json({
            message: 'Answer saved successfully.',
            answers: attempt.answers,
        });

    } catch (error) {
        console.error('Error updating answer:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Finish an exam attempt
// @route   POST /api/attempts/:attemptId/finish
// @access  Private (with exam token)
const finishAttempt = async (req, res) => {
    try {
        // The examAuthMiddleware will validate the token and attach the attempt to the request.
        const attempt = req.attempt;

        // 1. Check if the attempt is already completed
        if (attempt.status === 'completed') {
            return res.status(400).json({ message: 'This exam has already been marked as completed.' });
        }

        // 2. Mark the attempt as completed
        attempt.status = 'completed';
        attempt.finishedAt = new Date();

        // 3. Save the changes
        await attempt.save();

        res.json({
            message: 'Exam attempt finished successfully.',
            attempt: {
                id: attempt.id,
                status: attempt.status,
                finishedAt: attempt.finishedAt,
            }
        });

    } catch (error) {
        console.error('Error finishing attempt:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
  startAttempt,
  updateAnswer,
  finishAttempt,
};
