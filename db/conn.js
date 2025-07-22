const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("redflix", "root", "123456", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("Conectado ao banco de dados com sequelize");
} catch (error) {
  console.log(error);
}

module.exports = sequelize;
