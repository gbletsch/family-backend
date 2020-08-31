import { Request, Response } from "express";
import knex from "../database/connection";

class FeedController {
  async index(request: Request, response: Response) {
    const { user } = request.body;

    knex("feed")
      .select("*")
      .then((feed) => {
        const serializedFeed = feed.map((feedItem) => {
          return {
            ...feedItem,
            photoUrl: `http://192.168.0.7:3333/uploads/${feedItem.photo}`,
            user_id: user.id,
            name: user.name,
            avatar: user.avatar,
          };
        });
        return response.json(serializedFeed);
      })
      .catch((error) => {
        console.error("FeedController -> index -> error", error);
        return response.json({ error });
      });
  }

  create(request: Request, response: Response) {
    const { title, text, user_id } = request.body;

    // const user_id = request.header("user_id");
    // TODO: não consegui ainda checar a chave estrangeira
    knex("feed")
      .insert({
        title,
        text,
        user_id,
        photo: request.file.filename,
      })
      .then((result) => {
        return response.json({
          id: result[0],
          title,
          text,
          user_id,
          photo: request.file.filename,
        });
      })
      .catch((error) => {
        console.error(error);
        response.json({ error });
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
  }
}

export default FeedController;

// TODO: adicionar um timestamp no feed para ordenar no front
