import { Request, Response } from 'express';
import prisma from '../lib/prismaclient';
import { QueryList } from '../types/express/query.types';

export async function createArticle(req: Request, res: Response) {
  const userId = req.userId;

  // article 저장하기
  const { title, content } = req.body;

  const articleCreate = await prisma.article.create({
    data: {
      title,
      content,
      userId,
    },
  });

  res.status(201).json(articleCreate);
}

export async function getArticlesList(req: Request, res: Response) {
  const { offset, limit, title, content, orderBy } = req.validated as QueryList;

  const articles = await prisma.article.findMany({
    where: {
      title: {
        contains: title,
      },
      content: {
        contains: content,
      },
    },
    skip: offset,
    take: limit,
    orderBy,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  if (!articles)
    return res.status(401).json({ message: '게시글 목록을 찾을 수 없습니다' });

  res.status(200).json(articles);
}

export async function getArticleInfo(req: Request, res: Response) {
  const articleId = req.article.id;
  const article = await prisma.article.findUniqueOrThrow({
    where: { id: articleId },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  // 현재 User가 좋아요 했는지 확인하기
  const userId = req.user.id;

  const checkLiked = await prisma.articleLikes.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });

  let isLiked = false;
  if (checkLiked) {
    isLiked = true;
  }

  res.status(200).json({ article, isLiked });
}

export async function updateArticle(req: Request, res: Response) {
  const articleId = req.article.id;

  const articleUpdate = await prisma.article.update({
    where: { id: articleId },
    data: req.body,
  });

  res.status(200).json(articleUpdate);
}

export async function deleteArticle(req: Request, res: Response) {
  const articleId = req.article.id;

  await prisma.article.delete({
    where: { id: articleId },
  });

  res.status(204).json({ message: '삭제 완료' });
}
