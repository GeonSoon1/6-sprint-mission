import { BadRequestError, NotFoundError } from '../libs/error';
import prisma from '../libs/prismaClient';
import { Request, Response, NextFunction } from 'express';

async function createProductComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { productId } = req.validatedProductId!;
  if (!productId) throw new BadRequestError();
  const { content } = req.validatedCommentCreate!;
  const data = await prisma.comment.create({
    data: { content, productId, userId: req.user!.id },
  });
  res.status(201).json(data);
}

async function getCommentsByProductId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { productId } = req.validatedProductId!;
  const { cursor, take = 10 } = req.validatedCommentGetList!;
  const data = await prisma.comment.findMany({
    where: { productId: productId! },
    take: take,
    skip: cursor ? 1 : 0,
    ...(cursor ? { cursor: { id: cursor } } : {}),
    orderBy: { createdAt: 'desc' },
    select: { id: true, content: true, createdAt: true },
  });

  res.status(200).json(data);
}

async function createArticleComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { articleId } = req.validatedArticleId!;
  if (!articleId) throw new BadRequestError();
  const { content } = req.validatedCommentCreate!;
  const data = await prisma.comment.create({
    data: { articleId, content, userId: req.user!.id },
  });
  res.status(201).json(data);
}

async function getCommentsByArticleId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { articleId } = req.validatedArticleId!;
  const cursor = req.query.cursor as string | undefined;
  const take = Number(req.query.take) || 10;

  const data = await prisma.comment.findMany({
    where: { articleId: articleId! },
    take: take,
    skip: cursor ? 1 : 0,
    ...(cursor ? { cursor: { id: cursor } } : {}),
    orderBy: { createdAt: 'desc' },
    select: { id: true, content: true, createdAt: true },
  });

  res.status(200).json(data);
}

async function updateComment(req: Request, res: Response, next: NextFunction) {
  const { id } = req.validatedId!;
  const { content } = req.validatedCommentUpdate!;
  const data = await prisma.comment.update({
    where: { id: id! },
    data: {
      content: content!,
      userId: req.user!.id,
    },
  });
  res.status(200).json(data);
}

async function deleteComment(req: Request, res: Response, next: NextFunction) {
  const { id } = req.validatedId!;
  const data = await prisma.comment.delete({
    where: { id: id! },
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
