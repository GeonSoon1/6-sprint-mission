import * as s from 'superstruct'
import { Request, Response, NextFunction } from 'express';

export const getNotificationQuerySchema = s.object({
  cursor: s.optional(s.string()),
  limit: s.optional(s.number()),
});

export function validateGetNotificationQuery(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    req.validatedNotificationQuery = s.create(req.query, getNotificationQuerySchema);
    next();
  } catch (e: unknown) {
    if (e instanceof s.StructError) return next(e);
    next(e);
  }
}