const { DataTypes } = require("sequelize");
const db = require("../db/conn");
const User = require("./User");
const Movie = require("./Movie");

const MovieFavs = db.define("MovieFavs", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: "id" },
  },
  movieId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Movie, key: "id" },
  },
});

MovieFavs.belongsTo(User, { foreignKey: "userId", onDelete: "Cascade" });
MovieFavs.belongsTo(Movie, { foreignKey: "movieId", onDelete: "Cascade" });
User.hasMany(MovieFavs, { foreignKey: "userId" });
Movie.hasMany(MovieFavs, { foreignKey: "movieId" });

module.exports = MovieFavs;
