// src/utils/jwt.ts
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types";

// 환경 변수를 string 타입으로 명시
const JWT_SECRET: string = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET: string =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "1h";
const JWT_REFRESH_EXPIRES_IN: string =
  process.env.JWT_REFRESH_EXPIRES_IN || "7d";

// 프로덕션 환경에서 기본값 사용 시 경고
if (process.env.NODE_ENV === "production") {
  if (!process.env.JWT_SECRET) {
    console.error("WARNING: JWT_SECRET is not set in production!");
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    console.error("WARNING: JWT_REFRESH_SECRET is not set in production!");
  }
}

/**
 * Access Token 생성
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: "market-board-api",
  });
};

/**
 * Refresh Token 생성
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: "market-board-api",
  });
};

/**
 * Access Token 검증
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
  return decoded;
};

/**
 * Refresh Token 검증
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  return decoded;
};

/**
 * Refresh Token 만료 시간 계산
 */
export const getRefreshTokenExpiration = (): Date => {
  const expiresIn = JWT_REFRESH_EXPIRES_IN;

  const match = expiresIn.match(/^(\d+)([dhms])$/);

  if (!match) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  let milliseconds = 0;

  switch (unit) {
    case "d":
      milliseconds = value * 24 * 60 * 60 * 1000;
      break;
    case "h":
      milliseconds = value * 60 * 60 * 1000;
      break;
    case "m":
      milliseconds = value * 60 * 1000;
      break;
    case "s":
      milliseconds = value * 1000;
      break;
    default:
      milliseconds = 7 * 24 * 60 * 60 * 1000;
  }

  return new Date(Date.now() + milliseconds);
};

/**
 * 토큰 디코딩 (검증 없이)
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string") {
      return null;
    }
    return decoded as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * 토큰 만료 여부 확인
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string" || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * 토큰 남은 시간 계산 (초 단위)
 */
export const getTokenRemainingTime = (token: string): number => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string" || !decoded.exp) {
      return 0;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = decoded.exp - currentTime;

    return remainingTime > 0 ? remainingTime : 0;
  } catch (error) {
    return 0;
  }
};
