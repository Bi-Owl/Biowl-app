const Exam = require('../models/exam');
const UserExam = require('../models/userExam');
const User = require('../models/user');

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
    res.status(500).send('خطای سرور');
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
    res.status(500).send('خطای سرور');
  }
};

// @desc    Purchase an exam
// @route   POST /api/exams/:examId/purchase
// @access  Private
const purchaseExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id;

    const exam = await Exam.findOne({ where: { id: examId, isHidden: false, isPurchasable: true } });
    if (!exam) {
      return res.status(404).json({ message: 'آزمون یافت نشد یا قابل خریداری نیست' });
    }

    const [userExam, created] = await UserExam.findOrCreate({
      where: { UserId: userId, ExamId: examId },
    });

    if (userExam.purchased) {
      return res.status(200).json({ message: 'آزمون قبلا خریداری شده است' });
    }

    userExam.purchased = true;
    await userExam.save();

    res.status(200).json({ message: 'آزمون با موفقیت خریداری شد' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
};

// @desc    Get all purchased exams for a user
// @route   GET /api/exams/purchased
// @access  Private
const getPurchasedExams = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      include: [{
        model: Exam,
        attributes: ['id', 'name', 'description', 'startTime', 'endTime', 'price'],
        through: {
          where: { purchased: true },
          attributes: []
        }
      }]
    });

    if (!user) {
        return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    res.json(user.Exams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
};

module.exports = {
  getPublicExams,
  getExamStatusForUser,
  purchaseExam,
  getPurchasedExams,
};
