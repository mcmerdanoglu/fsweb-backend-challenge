//import edilen kütüphaneler
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRouter = require("./auth/auth-router");
const usersRouter = require("./users/users-router");
const postsRouter = require("./posts/posts-router");
const commentsRouter = require("./comments/comments-router");
// Duruma göre
// const postsCommentsRouter = require("./posts/posts-comments-router");

const server = express();

//custom middleware
const restrict = require("./middleware/restricted");

// Buradakiler global middlewareler
server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan("dev"));

//Bunlar ise kullanılacak endpointler
server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);
server.use("/api/posts", resrict, postsRouter); // sadece giriş yapan kullanıcılar erişebilir!
server.use("/api/comments", restrict, commentsRouter); // sadece giriş yapan kullanıcılar erişebilir!
// Duruma göre
//server.use("/api/posts-comments", postsCommentsRouter);

module.exports = server;
