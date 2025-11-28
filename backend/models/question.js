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
    allowNull: false,
    comment: 'The total number of options for this question (e.g., 4).',
  },
  correctOption: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'The number of the correct option (e.g., 1, 2, 3, etc.).',
  },
});

module.exports = Question;
