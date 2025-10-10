const Admin = require('../models/admin');
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
