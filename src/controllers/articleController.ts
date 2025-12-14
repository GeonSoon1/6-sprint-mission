import type { Request, Response, NextFunction } from 'express';
import type {
  CreateArticleDto,
  UpdateArticleDto,
  CookieBag,
} from '../services/articleService';

import {
  getArticlesService,
  getArticleByIdService,
  createArticleService,
  getMyArticlesService,
  updateArticleService,
  deleteArticleService,
  toggleArticleLikeService,
} from '../services/articleService';

export async function getArticles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cookies = req.cookies as CookieBag;
    const data = await getArticlesService(cookies);
    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
}

export async function getArticleById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const cookies = req.cookies as CookieBag;
    const data = await getArticleByIdService(req.params.id, cookies);
    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
}

export async function createArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const body = req.body as CreateArticleDto;

    const article = await createArticleService(body, userId);
    return res.status(201).json(article);
  } catch (e) {
    next(e);
  }
}

export async function getMyArticles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const articles = await getMyArticlesService(userId);
    return res.status(200).json(articles);
  } catch (e) {
    next(e);
  }
}

export async function updateArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;
    const body = req.body as UpdateArticleDto;

    const updated = await updateArticleService(req.params.id, body, userId);
    return res.status(200).json(updated);
  } catch (e) {
    next(e);
  }
}

export async function deleteArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;

    await deleteArticleService(req.params.id, userId);
    return res.status(204).send();
  } catch (e) {
    next(e);
  }
}

export async function toggleArticleLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user!.id;

    const result = await toggleArticleLikeService(req.params.id, userId);
    return res.status(200).json(result);
  } catch (e) {
    next(e);
  }
}
