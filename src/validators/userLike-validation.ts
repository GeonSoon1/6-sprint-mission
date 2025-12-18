import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prismaclient';

export async function productLikeUpValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.id;
    const productId = req.product.id;

    // 이미 likeCount 증가 했다면 작업 종료
    const readProductLike = await prisma.productLikes.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (readProductLike)
      return res.status(401).json({ message: '이미 좋아요를 눌렀습니다' });

    next();
  } catch (err) {
    next(err);
  }
}

export async function productLikeDownValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.id;
    const product = req.product;
    const productId = product.id;

    // likeCount가 0 이하일 경우
    if (product.likeCount < 1)
      return res.status(401).json({ message: '더 이상 감소할 수 없습니다' });

    // 이미 likeCount 감소(삭제) 했다면 작업 종료
    const readProductLike = await prisma.productLikes.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!readProductLike)
      return res.status(401).json({ message: '이미 취소 하였습니다' });

    req.proLikeId = readProductLike.id;

    next();
  } catch (err) {
    next(err);
  }
}

export async function articleLikeUpValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.id;
    const articleId = req.article.id;

    // 이미 likeCount 증가 했다면 작업 종료
    const readProductLike = await prisma.articleLikes.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    if (readProductLike)
      return res.status(401).json({ message: '이미 좋아요를 눌렀습니다' });

    next();
  } catch (err) {
    next(err);
  }
}

export async function articleLikeDownValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.id;
    const article = req.article;
    const articleId = article.id;

    // likeCount가 0 이하일 경우
    if (article.likeCount < 1)
      return res.status(401).json({ message: '더 이상 감소할 수 없습니다' });

    // 이미 likeCount 감소(삭제) 했다면 작업 종료
    const readArticleLike = await prisma.articleLikes.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    if (!readArticleLike)
      return res.status(401).json({ message: '이미 취소 하였습니다' });

    req.artLikeId = readArticleLike.id;

    next();
  } catch (err) {
    next(err);
  }
}

export async function productLikeListValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId;
    const productLikeDB = await prisma.productLikes.findMany({
      where: { userId },
    });

    if (productLikeDB.length === 0)
      return res
        .status(401)
        .json({ message: '좋아요 한 제품 목록이 없습니다' });

    next();
  } catch (err) {
    next(err);
  }
}

export async function articleLikeListValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId;
    const articleLikeDB = await prisma.articleLikes.findMany({
      where: { userId },
    });

    if (articleLikeDB.length === 0)
      return res
        .status(401)
        .json({ message: '좋아요 한 게시글 목록이 없습니다' });

    next();
  } catch (err) {
    next(err);
  }
}
