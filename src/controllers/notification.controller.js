import { create } from "superstruct";
import { IdParamsStruct } from "../structs/common.struct.js"; 
import * as notificationService from "../services/notification.service.js";

export async function getMyNotifications(req, res) {

  const take = req.query.take ? Number(req.query.take) : undefined;
  const skip = req.query.skip ? Number(req.query.skip) : undefined;
  
  const list = await notificationService.getMyNotifications(req.user.id, { take, skip });
  return res.json(list);
}

export async function getUnreadCount(req, res) {
  const result = await notificationService.getUnreadCount(req.user.id);
  return res.json(result);
}

export async function readNotification(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const updated = await notificationService.readNotification(id, req.user.id);
  return res.json(updated);
}
