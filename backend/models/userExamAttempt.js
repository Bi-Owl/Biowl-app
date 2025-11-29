const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserExamAttempt = sequelize.define('UserExamAttempt', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  finishedAt: {
    type: DataTypes.DATE,
    allowNull: true, // Initially null, set when exam finishes
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed'),
    defaultValue: 'in_progress',
    allowNull: false,
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}, // Stores { questionId: answerOption }
  },
});

module.exports = UserExamAttempt;
