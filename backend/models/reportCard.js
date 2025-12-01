const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReportCard = sequelize.define('ReportCard', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  answerKeyPdfUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  showRank: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isHidden: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  correctAnswers: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Stores { questionId: correctOption }',
  },
});

module.exports = ReportCard;
