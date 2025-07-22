const express = require("express");
const MovieController = require("../controllers/MovieController");
const { checkAuth } = require("../helpers/checkAuth");
const movieRoutes = express.Router();

movieRoutes.post("/add-movie", checkAuth, MovieController.toggleMovie);
movieRoutes.get("/get-movie", checkAuth, MovieController.getMovies);

module.exports = movieRoutes;
