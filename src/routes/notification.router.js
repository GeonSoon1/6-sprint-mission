import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  getMyNotifications,
  getUnreadCount,
  readNotification,
} from "../controllers/notification.controller.js";

const notificationRouter = Router();

notificationRouter.get("/", asyncHandler(authenticate), asyncHandler(getMyNotifications));
notificationRouter.get("/unread-count", asyncHandler(authenticate), asyncHandler(getUnreadCount));
notificationRouter.patch("/:id(\\d+)/read", asyncHandler(authenticate), asyncHandler(readNotification));

export default notificationRouter;
