require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conn = require("./db/conn");
const authRoutes = require("./routes/AuthRoutes");
const commentRoutes = require("./routes/CommentRoutes");
const movieRoutes = require("./routes/MovieRoutes");
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/comment", commentRoutes);
app.use("/movies", movieRoutes);

conn
  .sync()
  .then(() => {
    app.listen(port);
    console.log("Servidor rodando");
  })
  .catch((err) => console.log(err));
