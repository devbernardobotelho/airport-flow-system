const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'airport_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'XXXXX',
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = sequelize;
