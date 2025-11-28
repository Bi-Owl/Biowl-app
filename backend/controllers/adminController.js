const Admin = require('../models/admin');
const User = require('../models/user');
const Exam = require('../models/exam');
const Question = require('../models/question');
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

    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

// ... (user management functions)

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
      await user.update({
        firstName,
        lastName,
        email,
        phoneNumber,
        nationalId,
        isActive,
        wallet,
      });
      res.json({ message: 'کاربر با موفقیت به روز شد' });
    } else {
      res.status(404).json({ message: 'کاربر یافت نشد' });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ message: 'کاربر با موفقیت حذف شد' });
    } else {
      res.status(404).json({ message: 'کاربر یافت نشد' });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};


// --- Exam Management ---

exports.createExam = async (req, res) => {
  try {
    const { name, description, startTime, endTime, isHidden, isPurchasable, price, duration } = req.body;
    const exam = await Exam.create({ name, description, startTime, endTime, duration, isHidden, isPurchasable, price });
    res.status(201).json({ message: 'آزمون با موفقیت ایجاد شد', exam });
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور', error: error.message });
  }
};

exports.getAllExams = async (req, res) => {
  try {
    const exams = await Exam.findAll();
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
      const { name, description, startTime, endTime, isHidden, isPurchasable, price, duration } = req.body;
      await exam.update({ name, description, startTime, endTime, duration, isHidden, isPurchasable, price });
      res.json({ message: 'آزمون با موفقیت به روز شد' });
    } else {
      res.status(404).json({ message: 'آزمون یافت نشد' });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (exam) {
      await exam.destroy();
      res.json({ message: 'آزمون با موفقیت حذف شد' });
    } else {
      res.status(404).json({ message: 'آزمون یافت نشد' });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};

// --- Question Management ---

exports.createQuestion = async (req, res) => {
    try {
        const { examId } = req.params;
        const { numberOfOptions, correctOption, position } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'لطفا یک تصویر برای سوال آپلود کنید' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        const question = await Question.create({
            position,
            imageUrl,
            numberOfOptions,
            correctOption,
            ExamId: examId,
        });

        res.status(201).json({ message: 'سوال با موفقیت ایجاد شد', question });
    } catch (error) {
        res.status(500).json({ message: 'خطای سرور', error: error.message });
    }
};

exports.getQuestionsForExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const questions = await Question.findAll({ 
            where: { ExamId: examId },
            order: [['position', 'ASC']]
        });
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
        // If a new image is uploaded, delete the old one
        if (req.file) {
            // Delete old image
            if (question.imageUrl) {
                const oldImagePath = path.join(__dirname, '..', question.imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            imageUrl = `/uploads/${req.file.filename}`;
        }
        
        await question.update({
            position,
            numberOfOptions,
            correctOption,
            imageUrl,
        });

        res.json({ message: 'سوال با موفقیت به روز شد' });
    } catch (error) {
        res.status(500).json({ message: 'خطای سرور', error: error.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await Question.findByPk(questionId);

        if (question) {
            // Delete the associated image file
            if (question.imageUrl) {
                const imagePath = path.join(__dirname, '..', question.imageUrl);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
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
