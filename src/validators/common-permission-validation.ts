import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prismaclient';
import {
  ProductCustom,
  ProductCommentCustom,
  ArticleCustom,
  ArticleCommentCustom,
} from '../types/express/body.types';

export async function productUserCheckValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const product = req.product as ProductCustom;
    const userId = req.userId;

    // Product 작성자와 동일한 user 인지 확인
    if (product.userId !== userId)
      return res
        .status(401)
        .json({ message: '제품을 등록한 사용자가 아닙니다' });

    next();
  } catch (err) {
    next(err);
  }
}

export async function proCommentUserCheckValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const comment = req.proComment as ProductCommentCustom;
    const userId = req.userId;

    // comment 작성자와 동일한 user 인지 확인
    if (comment.userId !== userId)
      return res
        .status(401)
        .json({ message: '댓글을 등록한 사용자가 아닙니다' });

    next();
  } catch (err) {
    next(err);
  }
}

export async function articleUserCheckValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const article = req.article as ArticleCustom;
    const userId = req.userId;

    // Product 작성자와 동일한 user 인지 확인
    if (article.userId !== userId)
      return res
        .status(401)
        .json({ message: '제품을 등록한 사용자가 아닙니다' });

    next();
  } catch (err) {
    next(err);
  }
}

export async function artCommentUserCheckValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const comment = req.artComment as ArticleCommentCustom;
    const userId = req.userId;

    // comment 작성자와 동일한 user 인지 확인
    if (comment.userId !== userId)
      return res
        .status(401)
        .json({ message: '댓글을 등록한 사용자가 아닙니다' });

    next();
  } catch (err) {
    next(err);
  }
}
