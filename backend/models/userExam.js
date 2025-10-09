const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserExam = sequelize.define('UserExam', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  purchased: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Default to not purchased
  },
});

module.exports = UserExam;
