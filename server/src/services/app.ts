import * as express from "express";
import { json } from "body-parser";
import * as cors from "cors";

const app = express();

app.use(json());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ test: true });
});

app.all("*", (req, res) => {
  res.status(404).json({ errors: { server: "Not found" } });
});

export default app;
