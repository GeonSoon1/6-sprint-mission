import "./config/env.js";
import express from "express";
import http from "http";
import { setupWebSocket } from "./websocket.js";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { PORT, PUBLIC_PATH, STATIC_PATH } from "./lib/constants.js";
import articlesRouter from "./routers/article-route.js";
import productsRouter from "./routers/product-route.js";
import commentsRouter from "./routers/comment-route.js";
import imagesRouter from "./routers/upload.js";
import authRouter from "./routers/authRouter.js";
import {
  NotFoundHandler as defaultNotFoundHandler,
  globalErrorHandler,
} from "./lib/errors/errorHandler.js";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use("/articles", articlesRouter);
app.use("/products", productsRouter);
app.use("/comments", commentsRouter);
app.use("/images", imagesRouter);
app.use("/auth", authRouter);

app.get("/config", (_req, res) => {
  res.json({ serverUrl: `http://localhost:${PORT}` });
});

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

setupWebSocket(server, app);

export default app;