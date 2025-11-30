const Exam = require('../models/exam');
const UserExam = require('../models/userExam');
const User = require('../models/user');
const Question = require('../models/question');
const UserExamAttempt = require('../models/userExamAttempt');
const sequelize = require('../config/database');

// @desc    Get all public exams
// @route   GET /api/exams
// @access  Public
const getPublicExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({
      where: { isHidden: false },
      attributes: ['id', 'name', 'description', 'startTime', 'endTime', 'price', 'isPurchasable'],
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

    if (userExam && userExam.purchased) {
      res.json({ purchased: true });
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
  const t = await sequelize.transaction();
  try {
    const { examId } = req.params;
    const userId = req.user.id;

    // Get user and exam within the transaction
    const user = await User.findByPk(userId, { transaction: t });
    const exam = await Exam.findOne({ 
      where: { id: examId, isHidden: false, isPurchasable: true },
      transaction: t 
    });

    if (!exam) {
      await t.rollback();
      return res.status(404).json({ message: 'آزمون یافت نشد یا قابل خریداری نیست' });
    }

    const [userExam, created] = await UserExam.findOrCreate({
      where: { UserId: userId, ExamId: examId },
      transaction: t
    });

    if (userExam.purchased) {
      await t.rollback();
      return res.status(400).json({ message: 'آزمون قبلا خریداری شده است' });
    }

    // Handle payment if the exam is not free
    if (exam.price !== 'free') {
      const price = parseFloat(exam.price);
      if (isNaN(price)) {
        await t.rollback();
        return res.status(500).json({ message: 'قیمت آزمون نامعتبر است' });
      }

      if (user.wallet < price) {
        await t.rollback();
        return res.status(400).json({ message: 'موجودی کیف پول شما کافی نیست' });
      }

      // Deduct from wallet
      user.wallet -= price;
      await user.save({ transaction: t });
    }

    // Mark as purchased
    userExam.purchased = true;
    await userExam.save({ transaction: t });

    await t.commit();
    res.status(200).json({ message: 'آزمون با موفقیت خریداری شد', newBalance: user.wallet });

  } catch (err) {
    await t.rollback();
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
        attributes: ['id', 'name', 'description', 'startTime', 'endTime', 'price', 'duration'],
        through: {
          where: { purchased: true },
          attributes: []
        }
      }]
    });

    if (!user) {
        return res.status(404).json({ message: "کاربر یافت نشد" });
    }

    // Manually fetch and process details for each exam
    const examsWithDetails = await Promise.all(user.Exams.map(async (exam) => {
      const plainExam = exam.get({ plain: true });

      let attempt = await UserExamAttempt.findOne({
        where: {
          UserId: userId,
          ExamId: plainExam.id
        },
        order: [['createdAt', 'DESC']]
      });

      // --- Auto-complete logic ---
      if (attempt && attempt.status === 'in_progress' && plainExam.duration) {
        const endTime = new Date(attempt.startedAt).getTime() + plainExam.duration * 60 * 1000;
        if (new Date().getTime() > endTime) {
          attempt.status = 'completed';
          attempt.finishedAt = new Date(endTime); // Set finishedAt to the calculated end time
          await attempt.save();
        }
      }
      // --- End of auto-complete logic ---

      const questionCount = await Question.count({ where: { ExamId: plainExam.id } });

      plainExam.attempt = attempt ? { id: attempt.id, status: attempt.status } : null;
      plainExam.questionCount = questionCount;
      
      return plainExam;
    }));

    res.json(examsWithDetails);
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
