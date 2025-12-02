const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Explanation = sequelize.define('Explanation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'The order of the explanation within the exam, shown before the question with this number.',
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'URL to the image that contains the explanation content.',
  },
});

module.exports = Explanation;
