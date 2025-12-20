import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { UnauthorizedError } from "../utils/errors";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("인증 토큰이 필요합니다.");
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      nickname: decoded.nickname,
    };

    next();
  } catch (error) {
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      next(new UnauthorizedError("유효하지 않은 토큰입니다."));
    } else if (error instanceof Error && error.name === "TokenExpiredError") {
      next(new UnauthorizedError("토큰이 만료되었습니다."));
    } else {
      next(error);
    }
  }
};

export const optionalAuthenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);

      req.user = {
        id: decoded.id,
        email: decoded.email,
        nickname: decoded.nickname,
      };
    }

    next();
  } catch (error) {
    // 선택적 인증이므로 에러가 발생해도 다음으로 진행
    next();
  }
};
