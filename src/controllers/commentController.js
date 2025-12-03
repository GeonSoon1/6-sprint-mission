import { NotFoundError } from '../libs/error.js';
import prisma from '../libs/prismaClient.js';

async function createProductComment(req, res, next) {
  const { productId } = req.params;
  const { content } = req.body;
  const data = await prisma.comment.create({
    data: { content, productId, userId: req.user.id },
  });
  res.status(201).json(data);
}

async function getCommentsByProductId(req, res, next) {
  const { productId } = req.params;
  const cursor = req.query.cursor;
  const take = parseInt(req.query.take) || 10;

  const data = await prisma.comment.findMany({
    where: { productId },
    take: take,
    skip: cursor ? 1 : 0,
    ...(cursor ? { cursor: { id: cursor } } : {}),
    orderBy: { createdAt: 'desc' },
    select: { id: true, content: true, createdAt: true },
  });

  // if (data.length === 0) {
  //   return next(new NotFoundError());
  // }

  res.status(200).json(data);
}

async function createArticleComment(req, res, next) {
  const { articleId } = req.params;
  const { content } = req.body;
  const data = await prisma.comment.create({
    data: { articleId, content, userId: req.user.id },
  });
  res.status(201).json(data);
}

async function getCommentsByArticleId(req, res, next) {
  const { articleId } = req.params;
  const cursor = req.query.cursor;
  const take = parseInt(req.query.take) || 10;

  const data = await prisma.comment.findMany({
    where: { articleId },
    take: take,
    skip: cursor ? 1 : 0,
    ...(cursor ? { cursor: { id: cursor } } : {}),
    orderBy: { createdAt: 'desc' },
    select: { id: true, content: true, createdAt: true },
  });

  // if (data.length === 0) {
  //   return next(new NotFoundError());
  // }

  res.status(200).json(data);
}

async function updateComment(req, res, next) {
  const { id } = req.params;
  const data = await prisma.comment.update({
    where: { id },
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.status(200).json(data);
}

async function deleteComment(req, res, next) {
  const { id } = req.params;
  const data = await prisma.comment.delete({
    where: { id },
  });
  res.status(204).json(data);
}

export {
  createProductComment,
  getCommentsByProductId,
  updateComment,
  deleteComment,
  createArticleComment,
  getCommentsByArticleId,
};
