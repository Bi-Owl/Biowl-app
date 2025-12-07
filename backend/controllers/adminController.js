const sequelize = require('../config/database');
const Admin = require('../models/admin');
const User = require('../models/user');
const Exam = require('../models/exam');
const Question = require('../models/question');
const UserExam = require('../models/userExam');
const UserExamAttempt = require('../models/userExamAttempt');
const ReportCard = require('../models/reportCard');
const Explanation = require('../models/explanation');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است' });
    }
    const isMatch = await admin.isValidPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است' });
    }
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'شما با موفقیت به پنل مدیریت وارد شدید.', token });
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

// --- User Management ---
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'کاربر یافت نشد' });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      const { firstName, lastName, email, phoneNumber, nationalId, isActive, wallet } = req.body;
      await user.update({ firstName, lastName, email, phoneNumber, nationalId, isActive, wallet });
      res.json({ message: 'کاربر با موفقیت به روز شد' });
    } else {
      res.status(404).json({ message: 'کاربر یافت نشد' });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: `خطا: ${error.errors.map(e => `${e.path} وارد شده تکراری است`).join(', ')}` });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: `خطای اعتبارسنجی: ${error.errors.map(e => e.message).join(', ')}` });
    }
    res.status(500).json({ message: 'خطا در سرور هنگام ویرایش کاربر رخ داد.' });
  }
};

exports.deleteUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const user = await User.findByPk(req.params.id, { transaction: t });
    if (user) {
      await UserExam.destroy({ where: { UserId: user.id }, transaction: t });
      await UserExamAttempt.destroy({ where: { UserId: user.id }, transaction: t });
      await user.destroy({ transaction: t });
      await t.commit();
      res.json({ message: 'کاربر و تمام داده‌های مرتبط با او با موفقیت حذف شد' });
    } else {
      await t.rollback();
      res.status(404).json({ message: 'کاربر یافت نشد' });
    }
  } catch (error) {
    await t.rollback();
    console.error("Error deleting user:", error);
    res.status(500).json({ message: 'خطا در سرور هنگام حذف کاربر رخ داد.' });
  }
};

// --- Exam Management ---
exports.createExam = async (req, res) => {
  try {
    let { name, description, startTime, endTime, isHidden, isPurchasable, price, duration } = req.body;
    isPurchasable = isPurchasable === true || isPurchasable === 'true';
    isHidden = isHidden === true || isHidden === 'true';
    if (!name) {
      return res.status(400).json({ message: 'نام آزمون اجباری است.' });
    }
    const exam = await Exam.create({ name, description, startTime, endTime, duration, isHidden, isPurchasable, price });
    res.status(201).json({ message: 'آزمون با موفقیت ایجاد شد.', exam });
  } catch (error) {
    console.error("Error creating exam:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: `خطای اعتبارسنجی: ${error.errors.map(e => e.message).join(', ')}` });
    }
    res.status(500).json({ message: 'خطا در سرور هنگام ایجاد آزمون رخ داد.' });
  }
};

exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('Questions.id')), 'questionCount']
        ]
      },
      include: [{ model: Question, attributes: [] }],
      group: ['Exam.id'],
      order: [['createdAt', 'DESC']]
    });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (exam) {
      res.json(exam);
    } else {
      res.status(404).json({ message: 'آزمون یافت نشد' });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (exam) {
      let { name, description, startTime, endTime, isHidden, isPurchasable, price, duration } = req.body;
      isPurchasable = isPurchasable === true || isPurchasable === 'true';
      isHidden = isHidden === true || isHidden === 'true';
      await exam.update({ name, description, startTime, endTime, duration, isHidden, isPurchasable, price });
      res.json({ message: 'آزمون با موفقیت به روز شد' });
    } else {
      res.status(404).json({ message: 'آزمون یافت نشد' });
    }
  } catch (error) {
    console.error("Error updating exam:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: `خطای اعتبارسنجی: ${error.errors.map(e => e.message).join(', ')}` });
    }
    res.status(500).json({ message: 'خطا در سرور هنگام ویرایش آزمون رخ داد.' });
  }
};

exports.deleteExam = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const exam = await Exam.findByPk(req.params.id, { transaction: t });
    if (exam) {
      const examId = exam.id;
      const questions = await Question.findAll({ where: { ExamId: examId }, transaction: t });
      for (const question of questions) {
        if (question.imageUrl) {
          const imagePath = path.join(__dirname, '..', question.imageUrl);
          if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }
      }
      await Question.destroy({ where: { ExamId: examId }, transaction: t });
      const explanations = await Explanation.findAll({ where: { ExamId: examId }, transaction: t });
      for (const explanation of explanations) {
        if (explanation.imageUrl) {
          const imagePath = path.join(__dirname, '..', explanation.imageUrl);
          if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }
      }
      await Explanation.destroy({ where: { ExamId: examId }, transaction: t });
      const reportCard = await ReportCard.findOne({ where: { ExamId: examId }, transaction: t });
      if (reportCard && reportCard.answerKeyPdfUrl) {
        const pdfPath = path.join(__dirname, '..', reportCard.answerKeyPdfUrl);
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
      }
      await ReportCard.destroy({ where: { ExamId: examId }, transaction: t });
      await UserExam.destroy({ where: { ExamId: examId }, transaction: t });
      await UserExamAttempt.destroy({ where: { ExamId: examId }, transaction: t });
      await exam.destroy({ transaction: t });
      await t.commit();
      res.json({ message: 'آزمون و تمام داده‌های مرتبط با آن با موفقیت حذف شد' });
    } else {
      await t.rollback();
      res.status(404).json({ message: 'آزمون یافت نشد' });
    }
  } catch (error) {
    await t.rollback();
    console.error("Error deleting exam:", error);
    res.status(500).json({ message: 'خطا در سرور هنگام حذف آزمون رخ داد.' });
  }
};

exports.getExamsStatusOverview = async (req, res) => {
  try {
    const exams = await Exam.findAll({
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('UserExamAttempts.id')), 'attemptCount']
        ]
      },
      include: [{ model: UserExamAttempt, attributes: [] }],
      group: ['Exam.id'],
      order: [['createdAt', 'DESC']]
    });
    res.json(exams);
  } catch (error) {
    console.error("Error in getExamsStatusOverview:", error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

exports.getExamAttempts = async (req, res) => {
  try {
    const { examId } = req.params;
    const attempts = await UserExamAttempt.findAll({
      where: { ExamId: examId },
      include: { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] },
      order: [['createdAt', 'DESC']]
    });
    const questions = await Question.findAll({ where: { ExamId: examId }, attributes: ['id', 'correctOption'] });
    const correctAnswersMap = new Map(questions.map(q => [q.id, q.correctOption]));
    const totalQuestions = questions.length;
    const results = attempts.map(attempt => {
      const user = attempt.User;
      const result = {
        attemptId: attempt.id,
        status: attempt.status,
        user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
        stats: null
      };
      if (attempt.status === 'completed' && totalQuestions > 0) {
        let correctCount = 0;
        let incorrectCount = 0;
        const userAnswers = attempt.answers || {};
        for (const question of questions) {
          const userAnswer = userAnswers[question.id];
          const correctAnswer = correctAnswersMap.get(question.id);
          if (userAnswer) {
            if (userAnswer === correctAnswer) {
              correctCount++;
            } else {
              incorrectCount++;
            }
          }
        }
        const unansweredCount = totalQuestions - correctCount - incorrectCount;
        const score = (correctCount * 3) - incorrectCount;
        const maxScore = totalQuestions * 3;
        const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
        result.stats = {
          correct: correctCount,
          incorrect: incorrectCount,
          unanswered: unansweredCount,
          total: totalQuestions,
          percentage: Math.round(percentage * 100) / 100
        };
      }
      return result;
    });
    res.json(results);
  } catch (error) {
    console.error("Error in getExamAttempts:", error);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

// --- Question Management ---
exports.createQuestion = async (req, res) => {
  try {
    const { examId } = req.params;
    const { numberOfOptions, correctOption, position } = req.body;
    if (!numberOfOptions || !correctOption || !position) {
      return res.status(400).json({ message: 'داده‌های ارسالی برای سوال ناقص است.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'لطفا یک تصویر برای سوال آپلود کنید.' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const question = await Question.create({ position, imageUrl, numberOfOptions, correctOption, ExamId: examId });
    res.status(201).json({ message: 'سوال با موفقیت ایجاد شد', question });
  } catch (error) {
    console.error("Error creating question:", error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'خطا: ترتیب سوال نمی‌تواند تکراری باشد.' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: `خطای اعتبارسنجی: ${error.errors.map(e => e.message).join(', ')}` });
    }
    res.status(500).json({ message: 'خطا در سرور هنگام ایجاد سوال رخ داد.' });
  }
};

exports.getQuestionsForExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const questions = await Question.findAll({ where: { ExamId: examId }, order: [['position', 'ASC']] });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { numberOfOptions, correctOption, position } = req.body;
    const question = await Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({ message: 'سوال یافت نشد' });
    }
    let imageUrl = question.imageUrl;
    if (req.file) {
      if (question.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', question.imageUrl);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }
    await question.update({ position, numberOfOptions, correctOption, imageUrl });
    res.json({ message: 'سوال با موفقیت به روز شد' });
  } catch (error) {
    console.error("Error updating question:", error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'خطا: ترتیب سوال نمی‌تواند تکراری باشد.' });
    }
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: `خطای اعتبارسنجی: ${error.errors.map(e => e.message).join(', ')}` });
    }
    res.status(500).json({ message: 'خطا در سرور هنگام ویرایش سوال رخ داد.' });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findByPk(questionId);
    if (question) {
      if (question.imageUrl) {
        const imagePath = path.join(__dirname, '..', question.imageUrl);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }
      await question.destroy();
      res.json({ message: 'سوال با موفقیت حذف شد' });
    } else {
      res.status(404).json({ message: 'سوال یافت نشد' });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

exports.reorderQuestions = async (req, res) => {
  const { updates } = req.body;
  if (!updates || !Array.isArray(updates)) {
    return res.status(400).json({ message: 'اطلاعات ارسالی برای آپدیت نامعتبر است.' });
  }
  try {
    for (const update of updates) {
      await Question.update({ position: update.position }, { where: { id: update.id } });
    }
    res.status(200).json({ message: 'ترتیب سوالات با موفقیت به‌روزرسانی شد.' });
  } catch (error) {
    console.error("Error reordering questions:", error);
    res.status(500).json({ message: 'خطا در سرور هنگام مرتب‌سازی سوالات رخ داد.' });
  }
};

// --- Explanation Management ---
exports.createExplanation = async (req, res) => {
  try {
    const { examId } = req.params;
    const { displayOrder } = req.body;
    if (!displayOrder) {
      return res.status(400).json({ message: 'داده‌های ارسالی برای توضیحات ناقص است.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'لطفا یک تصویر برای توضیحات آپلود کنید.' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const explanation = await Explanation.create({ displayOrder, imageUrl, ExamId: examId });
    res.status(201).json({ message: 'توضیحات با موفقیت ایجاد شد', explanation });
  } catch (error) {
    console.error("Error creating explanation:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: `خطای اعتبارسنجی: ${error.errors.map(e => e.message).join(', ')}` });
    }
    res.status(500).json({ message: 'خطا در سرور هنگام ایجاد توضیحات رخ داد.' });
  }
};

exports.getExplanationsForExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const explanations = await Explanation.findAll({ where: { ExamId: examId }, order: [['displayOrder', 'ASC']] });
    res.json(explanations);
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

exports.updateExplanation = async (req, res) => {
  try {
    const { explanationId } = req.params;
    const { displayOrder } = req.body;
    const explanation = await Explanation.findByPk(explanationId);
    if (!explanation) {
      return res.status(404).json({ message: 'توضیحات یافت نشد' });
    }
    let imageUrl = explanation.imageUrl;
    if (req.file) {
      if (explanation.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', explanation.imageUrl);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }
    await explanation.update({ displayOrder, imageUrl });
    res.json({ message: 'توضیحات با موفقیت به روز شد' });
  } catch (error) {
    console.error("Error updating explanation:", error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: `خطای اعتبارسنجی: ${error.errors.map(e => e.message).join(', ')}` });
    }
    res.status(500).json({ message: 'خطا در سرور هنگام ویرایش توضیحات رخ داد.' });
  }
};

exports.deleteExplanation = async (req, res) => {
  try {
    const { explanationId } = req.params;
    const explanation = await Explanation.findByPk(explanationId);
    if (explanation) {
      if (explanation.imageUrl) {
        const imagePath = path.join(__dirname, '..', explanation.imageUrl);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }
      await explanation.destroy();
      res.json({ message: 'توضیحات با موفقیت حذف شد' });
    } else {
      res.status(404).json({ message: 'توضیحات یافت نشد' });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

// --- Report Card (Karnameh) Management ---
exports.publishReportCard = async (req, res) => {
  const { examId } = req.params;
  const { description, showRank } = req.body;
  const t = await sequelize.transaction();
  try {
    const exam = await Exam.findByPk(examId, { transaction: t });
    if (!exam) {
      await t.rollback();
      return res.status(404).json({ message: 'آزمون مورد نظر یافت نشد.' });
    }
    const questions = await Question.findAll({
      where: { ExamId: examId },
      attributes: ['id', 'correctOption'],
      transaction: t,
    });
    if (questions.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'نمی‌توان برای آزمون بدون سوال، کارنامه منتشر کرد.' });
    }
    const correctAnswers = questions.reduce((acc, q) => {
      acc[q.id] = q.correctOption;
      return acc;
    }, {});
    const [reportCard, isNew] = await ReportCard.findOrCreate({
      where: { ExamId: examId },
      defaults: {
        description: description,
        showRank: showRank === 'true' || showRank === true,
        correctAnswers: correctAnswers,
        isHidden: true,
      },
      transaction: t,
    });
    if (!isNew) {
      reportCard.description = description;
      reportCard.showRank = showRank === 'true' || showRank === true;
      reportCard.correctAnswers = correctAnswers;
    }
    if (req.file) {
      reportCard.answerKeyPdfUrl = `/uploads/${req.file.filename}`;
    }
    await reportCard.save({ transaction: t });
    const [updateCount] = await UserExamAttempt.update(
      { status: 'completed', finishedAt: new Date() },
      {
        where: {
          ExamId: examId,
          status: 'in_progress',
        },
        transaction: t,
      }
    );
    await t.commit();
    res.status(201).json({
      message: `کارنامه با موفقیت منتشر شد. ${updateCount} آزمون در حال انجام به وضعیت "تکمیل شده" تغییر یافت.`,
      reportCard,
    });
  } catch (error) {
    await t.rollback();
    console.error('Error publishing report card:', error);
    res.status(500).json({ message: 'خطای سرور هنگام انتشار کارنامه.' });
  }
};

exports.getExamsWithReportCardStatus = async (req, res) => {
    try {
      const exams = await Exam.findAll({
        attributes: ['id', 'name'],
        include: [{
          model: ReportCard,
          attributes: ['id', 'isHidden', 'createdAt', 'updatedAt', 'description', 'answerKeyPdfUrl'],
          required: false,
        }],
        order: [['createdAt', 'DESC']],
      });
      res.json(exams);
    } catch (error) {
      console.error('Error fetching exams with report card status:', error);
      res.status(500).json({ message: 'خطای سرور' });
    }
};

exports.updateReportCard = async (req, res) => {
    const { examId } = req.params;
    const { description, isHidden } = req.body;
    try {
        const reportCard = await ReportCard.findOne({ where: { ExamId: examId } });
        if (!reportCard) {
            return res.status(404).json({ message: 'کارنامه‌ای برای این آزمون یافت نشد. ابتدا آن را منتشر کنید.' });
        }
        reportCard.description = description;
        reportCard.isHidden = isHidden === 'true' || isHidden === true;
        if (req.file) {
            if (reportCard.answerKeyPdfUrl) {
                const oldPdfPath = path.join(__dirname, '..', reportCard.answerKeyPdfUrl);
                if (fs.existsSync(oldPdfPath)) fs.unlinkSync(oldPdfPath);
            }
            reportCard.answerKeyPdfUrl = `/uploads/${req.file.filename}`;
        }
        await reportCard.save();
        res.json({ message: 'کارنامه با موفقیت به‌روزرسانی شد.', reportCard });
    } catch (error) {
        console.error('Error updating report card:', error);
        res.status(500).json({ message: 'خطای سرور هنگام به‌روزرسانی کارنامه.' });
    }
};
