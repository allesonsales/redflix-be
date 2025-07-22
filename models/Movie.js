const { DataTypes } = require("sequelize");
const db = require("../db/conn");

const Movie = db.define("movies", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vote_average: {
    type: DataTypes.INTEGER,
  },
  release_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  overview: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  genre_names: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  poster_path: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  trailer: {
    type: DataTypes.STRING,
  },
});

module.exports = Movie;
