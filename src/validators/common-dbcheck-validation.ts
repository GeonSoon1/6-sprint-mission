import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prismaclient';
import { ProductCustom } from '../types/express/body.types';

export async function userDataValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // user 정보 검증
    if (!req.user)
      return res.status(401).json({ message: '사용자 정보를 확인 해 주세요' });

    const userId = Number(req.user.id);
    const userIdFloat = userId % 1;

    if (userId <= 0 || userIdFloat)
      return res.status(401).json({ message: '유효한 사용자 ID가 아닙니다' });

    const findUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!findUser)
      return res
        .status(401)
        .json({ message: '사용자 정보를 찾을 수 없습니다' });

    req.userId = userId;
    req.user = findUser;

    next();
  } catch (err) {
    next(err);
  }
}

export async function productDataValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // product 정보 검증
    const productId = Number(req.params.id);
    const productIdFloat = productId % 1;

    if (productId <= 0 || productIdFloat)
      return res.status(401).json({ message: '유효한 제품 ID가 아닙니다' });

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product)
      return res.status(401).json({ message: '제품 정보를 찾을 수 없습니다.' });

    req.product = product;

    next();
  } catch (err) {
    next(err);
  }
}

export async function productCommentDataValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // comment 정보 검증
    const commentId = Number(req.params.commentId);
    const commentIdFloat = commentId % 1;

    if (commentId <= 0 || commentIdFloat)
      return res.status(401).json({ message: '유효한 댓글 ID가 아닙니다' });

    const comment = await prisma.commentProduct.findUnique({
      where: { id: commentId },
    });
    if (!comment)
      return res.status(404).json({ message: '댓글 정보를 찾을 수 없습니다' });

    req.proComment = comment;

    next();
  } catch (err) {
    next(err);
  }
}

export async function articleDataValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // article 정보 검증
    const articleId = Number(req.params.id);
    const articleIdFloat = articleId % 1;

    if (articleId <= 0 || articleIdFloat)
      return res.status(401).json({ message: '유효한 게시글 ID가 아닙니다' });

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article)
      return res
        .status(401)
        .json({ message: '게시글 정보를 찾을 수 없습니다.' });

    req.article = article;
  } catch (err) {
    next(err);
  }
}

export async function articleCommentDataValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // comment 정보 검증
    const commentId = Number(req.params.commentId);
    const commentIdFloat = commentId % 1;

    if (commentId <= 0 || commentIdFloat)
      return res.status(401).json({ message: '유효한 댓글 ID가 아닙니다' });

    const comment = await prisma.commentArticle.findUnique({
      where: { id: commentId },
    });
    if (!comment)
      return res.status(404).json({ message: '댓글 정보를 찾을 수 없습니다' });

    req.artComment = comment;

    next();
  } catch (err) {
    next(err);
  }
}
