import express from "express";
import knex from "./database/connection";

const routes = express.Router();

routes.get("/", (request, response) => {
  response.json({ message: "Hello, world!!!" });
});

routes.get("/users", async (request, response) => {
  const users = await knex("users").select("*");

  const serializedUsers = users.map((user) => {
    return {
      name: user.name,
      avatar: `http://localhost:3333/assets/${user.avatar}`,
      email: user.email,
      id: user.id,
    };
  });

  return response.json(serializedUsers);
});



export default routes;
