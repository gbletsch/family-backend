import express from "express";

import multer from "multer";
import multerConfig from "./config/multer";

import FeedController from "./controllers/feedController";
import UsersController from "./controllers/usersController";

const routes = express.Router();
const upload = multer(multerConfig);

const feedController = new FeedController();
const usersController = new UsersController();

routes.get("/", (request, response) => {
  response.json({ message: "Hello, world!!!" });
});

routes.get("/users", usersController.index);
routes.get("/users/:id", usersController.show);

routes.get("/feed", feedController.index);
routes.post("/feed", upload.single("photo"), feedController.create);

export default routes;

// index, show, create, update, delete
