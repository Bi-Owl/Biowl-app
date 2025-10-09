const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findByPk(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: 'خطای دسترسی: کاربر یافت نشد' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'خطای دسترسی: توکن نامعتبر است' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'خطای دسترسی: توکن ارسال نشده است' });
  }
};

module.exports = { protect };
