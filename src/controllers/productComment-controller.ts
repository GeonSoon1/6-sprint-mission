import { Request, Response } from 'express';
import prisma from '../lib/prismaclient';

export async function createProductComment(req: Request, res: Response) {
  const userId = req.userId;
  const productId = req.product.id;

  const { content } = req.body;
  const commentCreate = await prisma.commentProduct.create({
    data: {
      content,
      userId,
      productId,
    },
    include: {
      product: true,
    },
  });

  res.status(201).json(commentCreate);
}

export async function getProductCommentList(req: Request, res: Response) {
  const productId = req.product.id;

  const productComments = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      },
    },
  });

  if (!productComments)
    return res
      .status(404)
      .json({ message: '제품의 댓글 목록을 찾을 수 없습니다' });

  res.status(200).json(productComments.comments);
}

export async function updateProductComment(req: Request, res: Response) {
  const commentId = req.proComment.id;
  const commentUpdate = await prisma.commentProduct.update({
    where: { id: commentId },
    data: req.body,
  });

  res.status(201).json(commentUpdate);
}

export async function deleteProductComment(req: Request, res: Response) {
  const commentId = req.proComment.id;
  await prisma.commentProduct.delete({
    where: { id: commentId },
  });

  res.status(204).json({ message: '삭제 완료' });
}
