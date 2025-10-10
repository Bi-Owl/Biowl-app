const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'توکن وجود ندارد، دسترسی رد شد' });
  }

  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'توکن وجود ندارد، دسترسی رد شد' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findByPk(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: 'توکن نامعتبر است' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'توکن معتبر نیست' });
  }
};
