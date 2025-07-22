const express = require("express");
const AuthController = require("../controllers/AuthController");
const { checkAuth } = require("../helpers/checkAuth");
const authRoutes = express.Router();

authRoutes.post("/registre-se", AuthController.createUser);
authRoutes.post("/verificar-email", AuthController.checkEmail);
authRoutes.post("/recuperar-senha", AuthController.recoverPassword);
authRoutes.post("/login", AuthController.login);
authRoutes.post("/delete", checkAuth, AuthController.deleteAccount);
authRoutes.post("/atualizar-foto", AuthController.updatePhoto);
authRoutes.post("/trocar-senha", AuthController.switchPassword);

module.exports = authRoutes;
