// Update with your config settings.
//Ayarlara göre değiştir

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const sharedConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  migrations: { directory: "./data/migrations" },
  seeds: { directory: "./data/seeds" },
  pool: {
    afterCreate: (conn, done) => conn.run("PRAGMA foreign_keys = ON", done),
  },
  useNullAsDefault: true,
};

module.exports = {
  development: {
    ...sharedConfig,
    connection: {
      filename: "./data/backendChallenge.db3",
    },
  },
  testing: {
    ...sharedConfig,
    connection: {
      filename: "./data/testBackendChallenge.db3",
    },
  },
};
