import express from "express";
import cors from "cors";
import { errors } from "celebrate";

import path from "path";
import routes from "./routes";

const port = process.env.port || 3333;

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

app.use("/assets", express.static(path.resolve(__dirname, "assets")));
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.use(errors());

app.listen(port);
