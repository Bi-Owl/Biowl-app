const Admin = require('../models/admin');
const User = require('../models/user');
const Exam = require('../models/exam');
const jwt = require('jsonwebtoken');

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
      const { firstName, lastName, email, phoneNumber, nationalId, isActive } = req.body;
      await user.update({
        firstName,
        lastName,
        email,
        phoneNumber,
        nationalId,
        isActive,
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
    const { name, description, startTime, endTime, isHidden, isPurchasable, price } = req.body;
    const exam = await Exam.create({ name, description, startTime, endTime, isHidden, isPurchasable, price });
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
      const { name, description, startTime, endTime, isHidden, isPurchasable, price } = req.body;
      await exam.update({ name, description, startTime, endTime, isHidden, isPurchasable, price });
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
