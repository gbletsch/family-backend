import express, { response, Request, Response, NextFunction } from "express";

import multer from "multer";
import multerConfig from "./config/multer";

import FeedController from "./controllers/feedController";
import UsersController from "./controllers/usersController";
import { celebrate, Joi } from "celebrate";
import jwt from "jsonwebtoken";

// import login from './middleware/login'
 
const routes = express.Router();
const upload = multer(multerConfig);

const feedController = new FeedController();
const usersController = new UsersController();

function login(request: Request, response: Response, next: NextFunction) {
  try {
    const token = request.headers.authorization?.split(" ")[1] || "123";
    const decode = jwt.verify(token, process.env.JWT_SECRET || "123");
    request.body.user = decode;
    next();
  } catch (error) {
    console.error("login -> error", error);
    return response.status(401).json({ error: "Falha na autenticação" });
  }
}

routes.get("/", (request, response) => {
  return response.json({ message: "Hello, world!!!" });
});

routes.post("/login", usersController.login);

// routes.get("/users", usersController.index);
routes.post("/users", upload.single("avatar"), usersController.create);

routes.get("/feed", login, feedController.index);
routes.delete("/feed/:id", login, feedController.delete);
routes.post(
  "/feed",
  login,
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
