import http from "http";
import geckos from "@geckos.io/server";
import express from "express";
import { json } from "body-parser";
import cors from "cors";
import config from "../config";
import router from "../router";

const app = express();

export const server = http.createServer(app);
export const io = geckos({
  iceServers: [
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
  cors: {
    origin: config.appUrl,
  },
});

io.addServer(server);

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
