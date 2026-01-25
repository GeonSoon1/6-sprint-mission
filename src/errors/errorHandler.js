import { Prisma } from "@prisma/client";
import { StructError } from "superstruct";
import BadRequestError from "./BadRequestError";
import ConflictError from "./ConflictError";
import ForbiddenError from "./ForbiddenError";
import NotFoundError from "./NotFoundError";
import UnauthorizedError from "./UnauthorizedError";

export function defaultNotFoundHandler(req, res) {
  return res.status(404).json({ message: "Not Found" });
}

export function globalErrorHandler(err, req, res, next) {
  if (err instanceof StructError || err instanceof BadRequestError) {
    return res.status(400).json({ message: err.message });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({ message: err.message });
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).json({ message: err.message });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({ message: err.message });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({ message: err.message });
  }

  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2025"
  ) {
    return res.sendStatus(400);
  }

  if (
    err instanceof Prisma.PrismaClientUnknownRequestError &&
    err.code === "P2002"
  ) {
    return res.status(409).json({ message: "Duplicate field value" });
  }

  return res
    .status(500)
    .json({ message: err.message || "Internal Server Error" });
}
