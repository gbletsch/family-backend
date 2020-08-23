import { Request, Response } from "express";
import knex from "../database/connection";

class FeedController {
  async index(request: Request, response: Response) {
    const { user_id } = request.query;
    console.log("FeedController -> index -> user_id", user_id);
    console.log("FeedController -> index -> request.query", request.query);

    let query = knex("feed").select("*");
    if (user_id) {
      query = query.where("user_id", String(user_id));
    }
    const feed = await query;

    return response.json(feed);
  }

  async create(request: Request, response: Response) {
    const { title, text } = request.body;
    const user_id = request.header("user_id");

    // const trx = await knex.transaction();
    const result = await knex("feed").insert({
      title,
      text,
      user_id,
    });

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

    return response.json({ message: result });
  }
}

export default FeedController;
