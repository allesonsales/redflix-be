const { raw } = require("mysql");
const Comment = require("../models/Comment");
const Movie = require("../models/Movie");
const User = require("../models/User");
const { where } = require("sequelize");

module.exports = class CommentController {
  static async newComment(req, res) {
    try {
      const { comment, movie } = req.body;
      const userId = req.user.id;

      const findMovie = await Movie.findOne({ where: { id: movie.id } });

      const newMovie = {
        id: movie.id,
        title: movie.title,
        genre_names: JSON.stringify(movie.genre_names),
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        poster_path: movie.poster_path,
      };

      if (!findMovie) {
        await Movie.create(newMovie);
      }

      const newComment = {
        comment,
        movieId: movie.id,
        userId,
      };

      await Comment.create(newComment);

      return res
        .status(200)
        .json({ message: "Comentário criado com sucesso!" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao criar comentário", error: error.message });
    }
  }

  static async getComments(req, res) {
    try {
      const { movieId } = req.body;
      const comments = await Comment.findAll({
        where: { movieId: movieId },
        include: [{ model: User, attributes: ["id", "username"] }],
        order: [["createdAt", "DESC"]],
      });

      return res.json(comments);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar comentários:", error: error.message });
    }
  }

  static async deleteComment(req, res) {
    try {
      const { id } = req.body;

      await Comment.destroy({ where: { id: id } });

      return res.status(200).json({
        message: "Comentário excluído!",
        image: "/comments/excluido.png",
      });
    } catch (error) {
      console.error(eror);
      return res.status(500).json({
        message: "Erro ao excluir comentário!",
        image: "/erro.png",
        error: error.message,
      });
    }
  }

  static async upComment(req, res) {
    try {
      const { id } = req.body;
      const comment = await Comment.findOne({ where: { id: id } });
      comment.likes += 1;
      await comment.save();
      return res.status(200).json({ comment });
    } catch (error) {
      console.error(eror);
      return res
        .status(500)
        .json({ message: "Erro ao dar like: ", error: error.message });
    }
  }

  static async downComment(req, res) {
    try {
      const { id } = req.body;
      const comment = await Comment.findOne({ where: { id: id } });
      comment.dislikes += 1;
      await comment.save();
      return res.status(200).json({ comment });
    } catch (error) {
      console.error(eror);
      return res.status(500).json({
        message: "Erro ao dar dislike: ",
        image: "/erro.png",
        error: error.message,
      });
    }
  }
};
