import http from "http";
import { Server } from "socket.io";
import express from "express";
import { json } from "body-parser";
import cors from "cors";
import config from "../config";
import router from "../router";

const app = express();

export const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: config.appUrl,
  },
});

app.use(json());
app.use(
  cors({
    origin(origin, next) {
      if (origin && !config.corsOrigins.includes(origin)) {
        return next(new Error("Not allowed by CORS"));
      }
      next(null, true);
    },
    credentials: true,
  })
);
app.use([router]);

app.all("*", (req, res) => {
  res.status(404).json({ errors: { server: "Not found" } });
});

export default app;
