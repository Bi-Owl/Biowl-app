const express = require('express');
const cors = require('cors');
const { DataTypes } = require('sequelize');
const sequelize = require('./config/database');
const User = require('./models/user');
const Exam = require('./models/exam');
const UserExam = require('./models/userExam');
const Admin = require('./models/admin'); // Import the Admin model
const Question = require('./models/question');
const UserExamAttempt = require('./models/userExamAttempt');
const ReportCard = require('./models/reportCard');
const Explanation = require('./models/explanation');

const examRoutes = require('./routes/examRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import the admin routes
const examAttemptRoutes = require('./routes/examAttemptRoutes');
const reportCardUserRoutes = require('./routes/reportCardUserRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define relationships
User.belongsToMany(Exam, { through: UserExam });
Exam.belongsToMany(User, { through: UserExam });
Exam.hasMany(Question);
Question.belongsTo(Exam);
Exam.hasMany(Explanation);
Explanation.belongsTo(Exam);
UserExamAttempt.belongsTo(User);
User.hasMany(UserExamAttempt);
UserExamAttempt.belongsTo(Exam);
Exam.hasMany(UserExamAttempt);
Exam.hasOne(ReportCard);
ReportCard.belongsTo(Exam);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attempts', examAttemptRoutes);
app.use('/api/report-cards', reportCardUserRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'حجم فایل ارسالی بیش از حد مجاز است.' });
    }
    return res.status(400).json({ message: `خطای آپلود فایل: ${err.message}` });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'فرمت داده‌های JSON ارسال شده نامعتبر است.' });
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    message: err.message || 'خطای داخلی سرور رخ داده است.',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: 'مسیر مورد نظر یافت نشد' });
});

// Sync database and start server
sequelize.sync().then(async () => { // Make the function async
  console.log('Database synced');

  // Ensure isExcludedFromScoring column exists on Questions table
  try {
    const queryInterface = sequelize.getQueryInterface();
    const tableDesc = await queryInterface.describeTable('Questions').catch(() => null);
    if (tableDesc && !tableDesc.isExcludedFromScoring) {
      await queryInterface.addColumn('Questions', 'isExcludedFromScoring', {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      });
      console.log('Added isExcludedFromScoring column to Questions table');
    }
  } catch (err) {
    console.error('Error verifying Questions table schema:', err.message);
  }

  // Create default admin if it doesn't exist
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

  const existingAdmin = await Admin.findOne({ where: { username: adminUsername } });

  if (!existingAdmin) {
    await Admin.create({ username: adminUsername, password: adminPassword });
    console.log('Default admin created');
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to sync database:', err);
});
