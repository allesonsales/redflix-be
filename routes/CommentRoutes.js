const express = require("express");
const CommentController = require("../controllers/commentController");
const { checkAuth } = require("../helpers/checkAuth");
const commentRoutes = express.Router();

commentRoutes.post("/add", checkAuth, CommentController.newComment);
commentRoutes.post("/delete", checkAuth, CommentController.deleteComment);
commentRoutes.post("/like", checkAuth, CommentController.upComment);
commentRoutes.post("/dislike", checkAuth, CommentController.downComment);
commentRoutes.get("/get", checkAuth, CommentController.getComments);

module.exports = commentRoutes;
