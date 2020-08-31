import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string('password').notNullable();
    table.string("avatar");
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("users");
}
