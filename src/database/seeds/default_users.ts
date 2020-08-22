import Knex from "knex";
import path from "path";

export async function seed(knex: Knex) {
  await knex("users").insert([
    {
      email: "gui@email.com",
      name: "Gui",
      avatar: "boy.png",
    },
    {
      email: "patty@email.com",
      name: "Patty",
      avatar: "girl.png",
    },
  ]);
}
