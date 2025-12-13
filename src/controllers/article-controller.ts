import { Request, Response } from 'express';
import prisma from '../lib/prismaclient';
import { QueryList } from '../types/express/query.types';
import {
  CreateArticleRequestDto,
  GetArticlesRequestDto,
} from '../dto/article.dto';
import { articleService } from '../service/article.service';

export async function createArticle(req: Request, res: Response) {
  const userId = req.user.id;
  const requestDto = req.body;

  const article = await articleService.createArticle(requestDto, userId);
  res.status(201).json(article);
}

export async function getArticlesList(req: Request, res: Response) {
  const query = req.query;
  const articles = await articleService.readArticles(query);
  res.status(200).json(articles);
}

export async function getArticleInfo(req: Request, res: Response) {
  const paramId = req.params.id;
  const article = await articleService.readArticle(paramId);

  const userId = req.user.id;
  let isLiked;
  if (userId) {
    isLiked = await articleService.readArticleLike(paramId, userId);
  }

  res.status(200).json({ article, isLiked });
}

export async function updateArticle(req: Request, res: Response) {
  const body = req.body;
  const articleId = req.params.id;
  const userId = req.user.id;

  const articleUpdate = await articleService.updateArticle(
    body,
    articleId,
    userId
  );

  res.status(200).json(articleUpdate);
}

export async function deleteArticle(req: Request, res: Response) {
  const articleId = req.params.id;
  const userId = req.user.id;

  await articleService.deleteArticle(articleId, userId);

  res.status(204).json({ message: '삭제 완료' });
}
