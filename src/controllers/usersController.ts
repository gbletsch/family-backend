import { Request, Response } from "express";
import knex from "../database/connection";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

require("dotenv").config();

class UsersController {
  async login(request: Request, response: Response) {
    const { email, password } = request.body;
    const result = await knex("users").where("email", email).select("*");

    if (result.length != 1) {
      return response.status(401).json({ error: "falha na autenticação" });
    }
    bcrypt.compare(password, result[0].password, (error, res) => {
      if (error) {
        console.error("UsersController -> login -> error", error);
        return response.status(500).json({ error: "falha na autenticação" });
      }
      if (!res) {
        return response.status(401).json({ error: "falha na autenticação" });
      }

      const token = jwt.sign(
        {
          id: result[0].id,
          name: result[0].name,
          avatar: `http://192.168.0.7:3333/uploads/${result[0].avatar}`,
        },
        process.env.JWT_SECRET || "123",
        {
          expiresIn: "7d",
        }
      );
      return response.json({
        message: "entrou",
        token,
      });
    });
  }

  // async show(request: Request, response: Response) {
  //   const { id } = request.params;
  //   const result = await knex("users").select("*").where("id", id).first();

  //   if (!result) {
  //     return response.status(400).json({ message: "user not found" });
  //   }
  //   return response.json(result);
  // }

  // async index(request: Request, response: Response) {
  //   const users = await knex("users").select("*");

  //   const serializedUsers = users.map((user) => {
  //     return {
  //       name: user.name,
  //       avatar: `http://localhost:3333/assets/${user.avatar}`,
  //       email: user.email,
  //       id: user.id,
  //     };
  //   });
  //   return response.json(serializedUsers);
  // }

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
          return response.json({
            id: result[0],
            name,
            email,
            avatar,
          });
        })
        .catch((error) => {
          console.error("UsersController -> create -> error", error);
          return response.status(500).json({ error });
        });
    });
  }
}

export default UsersController;
