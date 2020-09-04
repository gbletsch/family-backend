import { Request, Response } from "express";
import knex from "../database/connection";
import { PHOTO_URL } from "../assets/constants";
import fs from "fs";

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
            photoUrl: `${PHOTO_URL}${feedItem.photo}`,
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
        console.log("FeedController -> create -> result", result);
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

  async delete(request: Request, response: Response) {
    const idToDelete = request.params.id;
    const userId = request.body.user.id;
    const photo = request.params.photo;

    knex("feed")
      // .returning('photo') // não funciona com o sqlite
      .where("id", Number(idToDelete))
      .where("user_id", Number(userId))
      .del()
      .then((result) => {
        fs.unlink(`uploads/${photo}`, (err) => console.error(err));
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
