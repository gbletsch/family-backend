import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("posts", (table) => {
    table.increments("id").primary();
    table.integer("user_id").notNullable().references("id").inTable("users");
    table.string("photo");
    table.string("title");
    table.string("text");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("posts");
}
