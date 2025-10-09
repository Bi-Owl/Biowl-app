const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/user');
const Exam = require('./models/exam');
const UserExam = require('./models/userExam');
const examRoutes = require('./routes/examRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Define relationships
User.belongsToMany(Exam, { through: UserExam });
Exam.belongsToMany(User, { through: UserExam });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to sync database:', err);
});
