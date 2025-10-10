const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Admin = sequelize.define('Admin', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Admin.beforeCreate(async (admin) => {
  if (admin.password) {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
  }
});

Admin.prototype.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = Admin;
