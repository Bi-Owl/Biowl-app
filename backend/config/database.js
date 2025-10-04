require('dotenv').config();
const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';

const developmentConfig = {
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || './db.sqlite',
  logging: false,
};

const productionConfig = {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
};

const sequelize = new Sequelize(
  isProduction ? productionConfig.database : '',
  isProduction ? productionConfig.username : null,
  isProduction ? productionConfig.password : null,
  {
    ...(isProduction ? productionConfig : developmentConfig)
  }
);

module.exports = sequelize;
