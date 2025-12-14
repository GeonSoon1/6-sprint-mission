import prisma from '../lib/prismaClient';
import { assert } from 'superstruct';
import { CreateArticle, PatchArticle } from '../structs/articleStruct.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants';
import { verifyAccessToken } from '../lib/token';

function getOptionalUserId(req) {
  try {
    const token = req.cookies?.[ACCESS_TOKEN_COOKIE_NAME];
    if (!token) return null;
    const decoded = verifyAccessToken(token);
    return decoded.id;
  } catch {
    return null;
  }
}

export const getArticles = async (req, res) => {
  const userId = getOptionalUserId(req);

  const articles = await prisma.article.findMany({
    include: { likes: true },
    orderBy: { createdAt: 'desc' },
  });

  const mapped = articles.map((a) => {
    const likeCount = a.likes.length;
    const isLiked = userId
      ? a.likes.some((like) => like.userId === userId)
      : false;

    const { likes, ...rest } = a;
    return { ...rest, likeCount, isLiked };
  });

  return res.status(200).json(mapped);
};

export const getArticleById = async (req, res) => {
  const { id } = req.params;
  const userId = getOptionalUserId(req);

  const article = await prisma.article.findUnique({
    where: { id },
    include: { likes: true },
  });

  if (!article) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }

  const likeCount = article.likes.length;
  const isLiked = userId
    ? article.likes.some((like) => like.userId === userId)
    : false;

  const { likes, ...rest } = article;
  return res.status(200).json({ ...rest, likeCount, isLiked });
};

export const createArticle = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  if (!title || !content) {
    return res
      .status(400)
      .json({ message: '제목과 내용을 모두 입력해주세요.' });
  }

  const article = await prisma.article.create({
    data: {
      title,
      content,
      userId,
    },
  });

  return res.status(201).json(article);
};

export const getMyArticles = async (req, res) => {
  const userId = req.user.id;

  const articles = await prisma.article.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return res.status(200).json(articles);
};

export const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user.id;

  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }

  if (article.userId !== userId) {
    return res
      .status(403)
      .json({ message: '게시글을 수정할 권한이 없습니다.' });
  }

  const updatedArticle = await prisma.article.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
    },
  });

  return res.status(200).json(updatedArticle);
};

export const deleteArticle = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }

  if (article.userId !== userId) {
    return res
      .status(403)
      .json({ message: '게시글을 삭제할 권한이 없습니다.' });
  }

  await prisma.article.delete({
    where: { id },
  });

  return res.status(204).send();
};

export const toggleArticleLike = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
  }

  const existing = await prisma.articleLike.findFirst({
    where: { userId, articleId: id },
  });

  if (existing) {
    await prisma.articleLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.articleLike.create({
      data: { userId, articleId: id },
    });
  }

  const likeCount = await prisma.articleLike.count({
    where: { articleId: id },
  });

  return res.status(200).json({
    isLiked: !existing,
    likeCount,
  });
};
