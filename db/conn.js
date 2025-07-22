require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  }
);

try {
  sequelize.authenticate();
  console.log("Conectado ao banco de dados com sequelize");
} catch (error) {
  console.log(error);
}

module.exports = sequelize;
