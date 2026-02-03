import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.router.js";
import productRouter from "./routes/product.router.js";
import articleRouter from "./routes/article.router.js";
import commentRouter from "./routes/comment.router.js";
import userRouter from "./routes/user.router.js"
import {
  defaultNotFoundHandler,
  globalErrorHandler,
} from "./errors/errorHandler.js";
import notificationRouter from "./routes/notification.router.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);
app.use("/users", userRouter)
app.use('/notifications', notificationRouter)

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);


export default app;
