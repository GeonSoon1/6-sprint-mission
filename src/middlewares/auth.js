import { expressjwt } from 'express-jwt';
import prisma from '../libs/prismaClient.js';
import { AuthorizeError, BadRequestError } from '../libs/error.js';
import jwt from 'jsonwebtoken';

// 리퀘스트 토큰 검증 미들웨어
const verifyRefreshToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.refreshToken,
});

// 엑세스 토큰 검증 미들웨어
const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.accessToken,
});

// 유저 인가 미들웨어
async function authorizeUser(req, res, next) {
  const { userId } = req.auth;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) next(new BadRequestError());
  req.user = user;
  next();
}

// 토큰 유무 확인하는 전역 미들웨어
function optionalAuth(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) return next();
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // 검증 실패시 에러, 성공시 payload 반환
    if (!err) req.auth = decoded;
    next();
  });
}

// 유저가 생성한 상품인지 확인하는 미들웨어
async function authorizeProduct(req, res, next) {
  const userId = req.user.id;
  const { id } = req.params;
  const product = await prisma.product.findUniqueOrThrow({
    where: { id },
  });
  if (userId !== product.userId) next(new AuthorizeError());
  next();
}

// 유저가 생성한 게시글인지 확인하는 미들웨어
async function authorizeArticle(req, res, next) {
  const userId = req.user.id;
  const { id } = req.params;
  const article = await prisma.article.findUniqueOrThrow({
    where: { id },
  });
  if (userId !== article.userId) next(new AuthorizeError());
  next();
}

// 유저가 생성한 댓글인지 확인하는 미들웨어
async function authorizeComment(req, res, next) {
  const userId = req.user.id;
  const { id } = req.params;
  const comment = await prisma.comment.findUniqueOrThrow({
    where: { id },
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
