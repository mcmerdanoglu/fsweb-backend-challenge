//import edilen kütüphaneler
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRouter = require("./auth/auth-router");
const usersRouter = require("./users/users-router");
const postsRouter = require("./posts/posts-router");
const commentsRouter = require("./comments/comments-router");

const server = express();

//custom middleware
const restrict = require("./auth/restricted");

// Buradakiler global middlewareler
server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan("dev"));

//Bunlar ise kullanılacak endpointler
server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);
server.use("/api/posts", restrict, postsRouter); // restrict middlewarei, ilgili endpointlere sadece auth ile giriş yapan kullanıcıların erişebilmesi için!
server.use("/api/comments", restrict, commentsRouter); // restrict middlewarei, ilgili endpointlere sadece auth ile giriş yapan kullanıcıların erişebilmesi için!

module.exports = server;
