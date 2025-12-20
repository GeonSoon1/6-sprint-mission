// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { Prisma } from "@prisma/client";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Error:", err);

  // Prisma 에러 처리
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "이미 존재하는 데이터입니다.",
        error: err.message,
      });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({
        success: false,
        message: "요청한 데이터를 찾을 수 없습니다.",
        error: err.message,
      });
      return;
    }
  }

  // 커스텀 에러 처리
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // 기본 에러 처리
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "서버 오류가 발생했습니다."
        : err.message,
  });
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: "요청한 리소스를 찾을 수 없습니다.",
  });
};
