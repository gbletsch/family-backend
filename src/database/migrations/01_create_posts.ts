import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("feed", (table) => {
    table.increments("id");
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users");

    table.string("photo");
    table.string("title");
    table.string("text");
    table.timestamps(false, true);
  });
}

// TODO: não tá rolando a restrição de fazer o post somente com um users.id válido

export async function down(knex: Knex) {
  return knex.schema.dropTable("feed");
}
