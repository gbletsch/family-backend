import { Request, Response } from "express";
import knex from "../database/connection";

class FeedController {
  async index(request: Request, response: Response) {
    const { user_id } = request.query;

    let query = knex("feed")
      .join("users", "feed.user_id", "=", "users.id")
      .select("feed.*", "users.name", "users.avatar", "users.email");

    // TODO: acho que fica mais legal fazer esse controle no front
    if (user_id) {
      query = query.where("user_id", String(user_id));
    }

    const feed = await query;

    return response.json(feed);
  }

  async create(request: Request, response: Response) {
    const { title, text, photo, user_id } = request.body;
    // const user_id = request.header("user_id");

    const result = await knex("feed")
      .insert({
        title,
        text,
        user_id,
        photo,
      })
      .then((response) => console.log(response))
      .catch((error) => console.error(error));

    // .then((result) => {
    //   console.log("result", result)
    //   trx.commit
    //   return result
    // })
    // .catch((err) => {
    //   console.log('err', err)
    //   trx.rollback
    //   return 'fudeu'
    // });

    // TODO: não consegui ainda checar a chave estrangeira

    return response.json({ ids_created: result });
  }
}

export default FeedController;

// TODO: adicionar um timestamp no feed para ordenar no front
