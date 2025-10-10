const Admin = require('../models/admin');
const User = require('../models/user');
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
      await user.update(req.body);
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
