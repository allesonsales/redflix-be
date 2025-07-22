const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, where } = require("sequelize");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "O e-mail e a senha são obrigatórios." });
    }

    const user = await User.findOne({ raw: true, where: { email: email } });

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado!" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res
        .status(405)
        .json({ message: "Senha inválida, tente novamente!" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: `Seja bem vindo, ${user.userName}!`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userName: user.userName,
        photo: user.photo,
        createdAt: user.createdAt,
      },
      token,
    });
  }

  static async createUser(req, res) {
    const { name, userName, email, password, confirmPassword, photo } =
      req.body;

    if (!name) {
      return res.status(401).json({ message: "Por favor, digite o nome!" });
    }

    if (!userName) {
      return res
        .status(400)
        .json({ message: "Por favor, digite um nome de usuário!" });
    }

    if (!email) {
      return res.status(401).json({ message: "Por favor, digite um e-mail!" });
    }

    if (!password) {
      return res.status(401).json({ message: "Por favor, digite uma senha!" });
    }

    if (!confirmPassword) {
      return res
        .status(401)
        .json({ message: "Por favor, confirme sua senha!" });
    }

    const checkUser = await User.findOne({
      where: { userName: userName },
    });

    if (checkUser) {
      return res
        .status(400)
        .json({ message: `O usuário: ${userName} já existe, tente outro!` });
    }

    const checkUserEmail = await User.findOne({
      where: { email: email },
    });

    if (checkUserEmail) {
      return res.status(400).json({
        message: `O e-mail: ${email} já está cadastrado.`,
        recuperarSenha: "/redflix/recuperar",
      });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: `As senhas não batem, tente novamente!` });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      userName,
      email,
      password: hashedPassword,
      photo,
    };

    const userCreate = await User.create(user);

    const token = jwt.sign(
      { id: userCreate.id, email: userCreate.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      message: `Olá, seja bem-vindo ${userName}!`,
      user: {
        id: userCreate.id,
        userName: userCreate.userName,
        email: userCreate.email,
        photo: userCreate.photo,
      },
      token,
    });
  }

  static async checkEmail(req, res) {
    const { email } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Usuário não encontrado, tente novamente!" });
    }

    return res.status(200).json({ userName: user.userName });
  }

  static async recoverPassword(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Usuário não encontrado, tente novamente!" });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      await User.update(
        { password: hashedPassword },
        {
          where: { email: email },
        }
      );

      return res.status(200).json({ message: "Senha atualizada com sucesso!" });
    } catch (error) {
      console.log(error);
      console.error(
        `Erro ao tentar recuperar senha para email ${email}:`,
        error
      );
      return res.status(400).json({ message: `Erro ${error.message}` });
    }
  }

  static async switchPassword(req, res) {
    const { id, actualPassword, newPassword } = req.body;

    try {
      const user = await User.findOne({ where: { id: id } });
      const passwordMatch = bcrypt.compareSync(actualPassword, user.password);

      if (!passwordMatch) {
        return res
          .status(400)
          .json({ message: `A senha atual não bate com a senha cadastrada.` });
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      await User.update({ password: hashedPassword }, { where: { id: id } });

      const updatedUser = await User.findOne({ where: { id: id } });

      return res
        .status(200)
        .json({ message: "Senha atualizada com sucesso.", user: updatedUser });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Erro ao atualizar senha.", error: err.message });
    }
  }

  static async deleteAccount(req, res) {
    try {
      const id = req.user.id;

      const userModel = await User.findOne({ where: { id: id } });

      if (!userModel) {
        return res.status(400).json({ message: "Erro ao excluir!" });
      }

      await User.destroy({ where: { id: id } });

      return res.status(200).json({
        message: "Sua conta foi excluída, esperamos você de volta em breve!",
      });
    } catch (err) {
      console.error(err);
    }
  }

  static async updatePhoto(req, res) {
    try {
      const { id, photo } = req.body;

      const user = await User.findOne({ where: { id: id } });

      if (!user) {
        return res.status(400).json({ message: `Usuário não encontrado` });
      }

      await User.update(
        {
          photo,
        },
        { where: { id: id } }
      );

      const userUpdate = await User.findOne({ where: { id: id } });

      return res
        .status(200)
        .json({ message: `Foto atualizada com sucesso!`, user: userUpdate });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: `Erro ${err.message}` });
    }
  }
};
