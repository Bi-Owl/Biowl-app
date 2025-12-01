const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/user');
const Exam = require('./models/exam');
const UserExam = require('./models/userExam');
const Admin = require('./models/admin'); // Import the Admin model
const Question = require('./models/question');
const UserExamAttempt = require('./models/userExamAttempt');
const ReportCard = require('./models/reportCard');

const examRoutes = require('./routes/examRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import the admin routes
const examAttemptRoutes = require('./routes/examAttemptRoutes');
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
UserExamAttempt.belongsTo(User);
User.hasMany(UserExamAttempt);
UserExamAttempt.belongsTo(Exam);
Exam.hasMany(UserExamAttempt);
Exam.hasOne(ReportCard);
ReportCard.belongsTo(Exam);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/admin', adminRoutes); // Add the admin routes
app.use('/api/attempts', examAttemptRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Sync database and start server
sequelize.sync().then(async () => { // Make the function async
  console.log('Database synced');

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
