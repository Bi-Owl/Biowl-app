const Exam = require('../models/exam');
const UserExam = require('../models/userExam');

// @desc    Get all public exams
// @route   GET /api/exams
// @access  Public
const getPublicExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({
      where: { isHidden: false },
      attributes: ['id', 'name', 'description', 'startTime', 'endTime', 'price'],
    });
    res.json(exams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get purchase status of an exam for a user
// @route   GET /api/exams/:examId/status
// @access  Private
const getExamStatusForUser = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id;

    const userExam = await UserExam.findOne({
      where: {
        UserId: userId,
        ExamId: examId,
      },
    });

    if (userExam) {
      res.json({ purchased: userExam.purchased });
    } else {
      res.json({ purchased: false });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getPublicExams,
  getExamStatusForUser,
};
