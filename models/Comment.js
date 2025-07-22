const { DataTypes } = require("sequelize");
const db = require("../db/conn");
const User = require("./User");
const Movie = require("./Movie");

const Comment = db.define("Comment", {
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  dislikes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = Comment;

User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "userId" });

Movie.hasMany(Comment, { foreignKey: "movieId", onDelete: "CASCADE" });
Comment.belongsTo(Movie, { foreignKey: "movieId" });
