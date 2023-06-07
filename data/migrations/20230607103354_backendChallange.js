/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.increments("user_id").primary();
      table.string("username", 255).notNullable().unique();
      table.string("password", 255).notNullable();
      table.string("email").notNullable().unique();
    })
    .createTable("posts", function (table) {
      table.increments("post_id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.foreign("user_id").references("user_id").inTable("users");
      table.text("post_content").notNullable();
      table.timestamp("post_time").defaultTo(knex.fn.now());
    })
    .createTable("comments", function (table) {
      table.increments("comment_id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.foreign("user_id").references("user_id").inTable("users");
      table.integer("post_id").unsigned().notNullable();
      table.foreign("post_id").references("post_id").inTable("posts");
      table.text("comment_content").notNullable();
      table.timestamp("comment_time").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("comments")
    .dropTableIfExists("posts")
    .dropTableIfExists("users");
};
