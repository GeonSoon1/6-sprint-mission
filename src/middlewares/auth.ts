import { expressjwt } from 'express-jwt';
import prisma from '../libs/prismaClient';
import { AuthorizeError, BadRequestError } from '../libs/error';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AuthPayload } from '../../typings/express';

// 리퀘스트 토큰 검증 미들웨어
const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.refreshToken,
});

// 엑세스 토큰 검증 미들웨어
const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.accessToken,
});

// 유저 인증 미들웨어
async function authorizeUser(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) return next(new AuthorizeError());
  const { userId } = req.auth;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) next(new AuthorizeError());
  req.user = user!;
  next();
}

// 토큰 유무 확인하는 전역 미들웨어
function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.accessToken;
  if (!token) return next();
  jwt.verify(
    token,
    process.env.JWT_SECRET!,
    (err: unknown, decoded: unknown) => {
      // 검증 실패시 그냥 넘어감, 성공시 payload 반환
      if (err) return next();
      req.auth = decoded as AuthPayload;
      next();
    }
  );
}

// 유저가 생성한 상품인지 확인하는 미들웨어
async function authorizeProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user!.id; // user 가 ? 이기 때문에 확정을 시켜줘야 하는 것
  const { id } = req.params;
  const product = await prisma.product.findUniqueOrThrow({
    where: { id: id! },
  });
  if (userId !== product.userId) next(new AuthorizeError());
  next();
}

// 유저가 생성한 게시글인지 확인하는 미들웨어
async function authorizeArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user!.id;
  const { id } = req.params;
  const article = await prisma.article.findUniqueOrThrow({
    where: { id: id! },
  });
  if (userId !== article.userId) next(new AuthorizeError());
  next();
}

// 유저가 생성한 댓글인지 확인하는 미들웨어
async function authorizeComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user!.id;
  const { id } = req.params;
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id: id! },
  });
  if (userId !== comment.userId) next(new AuthorizeError());
  next();
}

export {
  verifyRefreshToken,
  verifyAccessToken,
  authorizeUser,
  optionalAuth,
  authorizeProduct,
  authorizeArticle,
  authorizeComment,
};
