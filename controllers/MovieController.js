const { where } = require("sequelize");
const Movie = require("../models/Movie");
const MovieList = require("../models/MovieList");

module.exports = class MovieController {
  static async getMovies(req, res) {
    try {
      const userId = req.user.id;

      const movies = await MovieList.findAll({
        where: { userId: userId },
        include: {
          model: Movie,
          attributes: [
            "id",
            "title",
            "overview",
            "genre_names",
            "release_date",
            "poster_path",
          ],
        },
      });

      return res.status(200).json(movies);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao buscar filmes" + err });
    }
  }

  static async toggleMovie(req, res) {
    try {
      const userId = req.user.id;
      const { movie, genresNames } = req.body;
      const findMovie = await Movie.findOne({ where: { id: movie.id } });

      const newMovie = {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        genre_names: JSON.stringify(genresNames),
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        poster_path: movie.poster_path,
      };

      if (!findMovie) {
        await Movie.create(newMovie);
      }

      const favMovie = {
        userId: userId,
        movieId: movie.id,
      };

      const findMovieInUser = await MovieList.findOne({
        where: { userId: userId, movieId: movie.id },
      });

      if (!findMovieInUser) {
        await MovieList.create(favMovie);
        return res.status(201).json({
          message: "Filme adicionado a sua lista!",
        });
      } else {
        try {
          await MovieList.destroy({
            where: { movieId: movie.id, userId },
          });
          return res.status(201).json({
            message: "Filme removido da sua lista!",
            icon: "bi-plus-circle",
          });
        } catch (error) {
          console.error("erro ao remover " + error);
        }
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Erro no toggleMovie", error: err.message });
    }
  }
};
