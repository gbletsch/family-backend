import { Request, Response } from "express";
import knex from "../database/connection";
import bcrypt from "bcrypt";

class UsersController {
  async show(request: Request, response: Response) {
    const { id } = request.params;
    const result = await knex("users").select("*").where("id", id).first();

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

  async create(request: Request, response: Response) {
    const { name, email, password } = request.body;
    const avatar = request.file.filename;

    bcrypt.hash(password, 10, (bcryptError, hashedPassword) => {
      if (bcryptError) {
        console.error("UsersController -> create -> bcryptError", bcryptError);
        return response.status(500).json({ bcryptError });
      }

      knex("users")
        .insert({
          name,
          email,
          avatar,
          password: hashedPassword,
        })
        .then((result) => {
          alert("Usuário criado com sucesso");
          return response.json({
            id: result[0],
            name,
            email,
            avatar,
          });
        })
        .catch((error) => {
          alert("Erro ao criar usuário");
          console.error("UsersController -> create -> error", error);
          return response.status(500).json({ error });
        });
    });
  }
}

export default UsersController;
