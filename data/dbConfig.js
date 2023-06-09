const knex = require("knex");
const configFile = require("../knexfile.js");
const environment = process.env.NODE_ENV || "development";

module.exports = knex(configFile[environment]);
