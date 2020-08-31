import express, { response } from "express";

import multer from "multer";
import multerConfig from "./config/multer";

import FeedController from "./controllers/feedController";
import UsersController from "./controllers/usersController";
import { celebrate, Joi } from "celebrate";

const routes = express.Router();
const upload = multer(multerConfig);

const feedController = new FeedController();
const usersController = new UsersController();

routes.get("/", (request, response) => {
  return response.json({ message: "Hello, world!!!" });
});

routes.get("/users", usersController.index);
routes.get("/users/:id", usersController.show);
routes.post("/users", upload.single("avatar"), usersController.create);

routes.get("/feed", feedController.index);
routes.post(
  "/feed",
  upload.single("photo"),
  celebrate(
    {
      body: Joi.object().keys({
        title: Joi.string().required(),
        text: Joi.string().required(),
        user_id: Joi.number().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  feedController.create
);

export default routes;

// index, show, create, update, delete
