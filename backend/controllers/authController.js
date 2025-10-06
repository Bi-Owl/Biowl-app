const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'لطفا تمام فیلدها را وارد کنید' });
  }

  try {
    // Check for user
    const user = await User.scope('withPassword').findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'ایمیل یا رمز عبور اشتباه است' });
    }
  } catch (error) {
    res.status(500).json({ message: 'خطایی در سرور رخ داده است', error: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { email, password, firstName, lastName, phoneNumber, nationalId } = req.body;

  if (!email || !password || !firstName || !lastName || !phoneNumber || !nationalId) {
    return res.status(400).json({ message: 'لطفا تمام فیلدها را وارد کنید' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'کاربری با این ایمیل قبلا ثبت‌نام کرده است' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      nationalId,
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'اطلاعات کاربری نامعتبر است' });
    }
  } catch (error) {
    // Check for unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      if (field === 'phoneNumber') {
        return res.status(400).json({ message: 'کاربری با این شماره تلفن قبلا ثبت‌نام کرده است' });
      }
      if (field === 'nationalId') {
        return res.status(400).json({ message: 'کاربری با این کد ملی قبلا ثبت‌نام کرده است' });
      }
    }
    res.status(500).json({ message: 'خطایی در سرور رخ داده است', error: error.message });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  register,
  login,
  getMe,
};
