import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.router";
import productRouter from "./routes/product.router";
import articleRouter from "./routes/article.router";
import commentRouter from "./routes/comment.router";
import userRouter from "./routes/user.router"
import {
  defaultNotFoundHandler,
  globalErrorHandler,
} from "./errors/errorHandler";
import notificationRouter from "./routes/notification.router";

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
