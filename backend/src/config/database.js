const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',

  storage: ':memory:',

  logging: false,
});


module.exports = sequelize;