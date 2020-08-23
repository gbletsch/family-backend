import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("name").notNullable();
    table.string('email').notNullable().unique()
    table.string("avatar");
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("users");
}
