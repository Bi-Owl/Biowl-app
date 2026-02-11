const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'The order of the question within the exam.',
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'URL to the image that contains the question text and all options.',
  },
  numberOfOptions: {
    type: DataTypes.INTEGER,
    allowNull: true, // Nullable for numeric questions
    comment: 'The total number of options for this question (e.g., 4).',
  },
  correctOption: {
    type: DataTypes.INTEGER,
    allowNull: true, // Nullable for numeric questions
    comment: 'The number of the correct option (e.g., 1, 2, 3, etc.).',
  },
  type: {
    type: DataTypes.ENUM('multiple_choice', 'numeric', 'multi_boolean'),
    defaultValue: 'multiple_choice',
    allowNull: false,
    comment: 'Type of the question: multiple_choice or numeric',
  },
  correctNumericAnswer: {
    type: DataTypes.JSON, // Changed to JSON to support multiple correct answers
    allowNull: true,
    comment: 'The correct answer(s) for numeric questions. Stored as an array of numbers.',
  },
});

module.exports = Question;
