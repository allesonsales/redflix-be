const { DataTypes } = require("sequelize");
const db = require("../db/conn");

const Movie = db.define("movies", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vote_average: {
    type: DataTypes.INTEGER,
  },
  release_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  overview: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  genre_names: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  poster_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  trailer: {
    type: DataTypes.STRING,
  },
});

module.exports = Movie;
