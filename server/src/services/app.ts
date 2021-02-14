import * as express from "express";
import { json } from "body-parser";
import * as cors from "cors";
import router from "./router";

const app = express();

app.use(json());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);
app.use(router);

export default app;
