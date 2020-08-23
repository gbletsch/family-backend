import { Request, Response } from "express";
import knex from "../database/connection";

class UsersController {
  async show(request: Request, response: Response) {
    const { id } = request.params;
    const result = await knex("users").select("*").where("id", id).first();
    console.log("UsersController -> show -> result", result);

    if (!result) {
      return response.status(400).json({ message: "user not found" });
    }
    return response.json(result);
  }

  async index(request: Request, response: Response) {
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
  }
}

export default UsersController;
