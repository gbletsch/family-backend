import { Request, Response } from "express";
import knex from "../database/connection";

class FeedController {
  index(request: Request, response: Response) {
    const { user } = request.body;

    knex("feed")
      .leftJoin("users", "users.id", "feed.user_id")
      .select("feed.*", "users.name")
      .then((feed) => {
        const userData = {
          user_id: user.id,
          name: user.name,
          avatar: user.avatar,
        };
        const serializedFeed = feed.map((feedItem) => {
          return {
            ...feedItem,
            photoUrl: `http://192.168.0.7:3333/uploads/${feedItem.photo}`,
          };
        });
        return response.json({ userData, serializedFeed });
      })
      .catch((error) => {
        console.error("FeedController -> index -> error", error);
        return response.json({ error });
      });
  }

  create(request: Request, response: Response) {
    const { title, text, user_id } = request.body;

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

  delete(request: Request, response: Response) {
    const idToDelete = request.params.id;
    const userId = request.body.user.id;

    knex("feed")
      .where("id", Number(idToDelete))
      .where("user_id", Number(userId))
      .del()
      .then((result) => {
        console.log("FeedController -> delete -> result", result);
        if ((result == 0)) {
          return response.json({ result });
        }
        return response.json({ result });
      })
      .catch((error) => {
        console.error("FeedController -> delete -> error", error);
        return response.status(400).json({ error });
      });
  }
}

export default FeedController;

// TODO: adicionar um timestamp no feed para ordenar no front
