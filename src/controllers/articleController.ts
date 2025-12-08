import { Prisma } from '@prisma/client';
import prisma from '../libs/prismaClient';
import { NextFunction, RequestHandler, Request, Response } from 'express';

async function createArticle(req: Request, res: Response, next: NextFunction) {
  const data = await prisma.article.create({
    data: {
      ...req.validatedArticleCreate!,
      userId: req.user!.id,
    },
  });
  res.status(201).json(data);
}

async function getArticles(req: Request, res: Response, next: NextFunction) {
  const {
    page = 1,
    limit = 10,
    search = '',
    sort = 'recent',
  } = req.validatedArticleQuery!;
  const skip = (page - 1) * limit;

  const where: Prisma.ArticleWhereInput = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const orderBy: Prisma.ArticleOrderByWithRelationInput = {
    createdAt: !sort || sort === 'recent' ? 'desc' : 'asc',
  };

  const data = await prisma.article.findMany({
    where,
    orderBy,
    skip,
    take: limit,
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      articleLikeCount: true,
    },
  });

  const userId = req.auth?.userId;
  if (userId) {
    const likedUser = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { likedArticles: true },
    });
    const likedArticles = likedUser.likedArticles.map((aid) => aid.articleId);
    const filterlikedArticles = data
      .filter((d) => likedArticles.includes(d.id))
      .map((d) => {
        const liked = { ...d, isLiked: true };
        return liked;
      });
    const filterArticles = data
      .filter((d) => !likedArticles.includes(d.id))
      .map((d) => {
        const notLiked = { ...d, isLiked: false };
        return notLiked;
      });
    const userData = [...filterlikedArticles, ...filterArticles];
    return res
      .status(200)
      .json(
        userData.sort((a, b) =>
          !sort || sort === 'recent'
            ? b.createdAt.getTime() - a.createdAt.getTime()
            : a.createdAt.getTime() - b.createdAt.getTime()
        )
      );
  } else {
    return res.status(200).json(data);
  }
}

async function getArticleById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.validatedId!;
  const data = await prisma.article.findUniqueOrThrow({
    where: { id: id! },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      articleLikeCount: true,
    },
  });

  const userId = req.auth?.userId;
  if (userId) {
    const likedArticle = await prisma.likedArticle.findUnique({
      where: { userId_articleId: { userId, articleId: id! } },
    });
    if (likedArticle) {
      return res.status(200).json({
        ...data,
        isLiked: true,
      });
    } else {
      return res.status(200).json({
        ...data,
        isLiked: false,
      });
    }
  }

  res.status(200).json(data);
}

async function updateArticle(req: Request, res: Response, next: NextFunction) {
  const { id } = req.validatedId!;
  const data = await prisma.article.update({
    where: { id: id! },
    data: {
      ...Object.fromEntries(
        // 객체를 배열로 바꿔서 배열메서드 사용 후 다시 객체로 변환
        Object.entries(req.validatedArticleUpdate!).filter(
          ([_, v]) => v !== undefined
        )
      ),
      userId: req.user!.id,
    },
  });
  res.status(200).json(data);
}

async function deleteArticle(req: Request, res: Response, next: NextFunction) {
  const { id } = req.validatedId!;
  const data = await prisma.article.delete({
    where: { id: id! },
  });
  res.status(204).json(data);
}

export {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
