import { Request, Response } from 'express';
import prisma from '../lib/prismaclient';

export async function likeCountUp(req: Request, res: Response) {
  const userId = req.user.id;
  const product = req.product;
  const productId = product.id;

  // likeCount 증가 작업
  const upProductLikeCount = product.likeCount + 1;

  const updateProductLikesCount = await prisma.product.update({
    where: { id: productId },
    data: { likeCount: Number(upProductLikeCount) },
  });

  // productLikes DB에 기록
  const updateProductLikesDB = await prisma.productLikes.create({
    data: {
      userId,
      productId,
    },
  });

  res.status(200).json({ updateProductLikesCount, updateProductLikesDB });
}

export async function likeCountDown(req: Request, res: Response) {
  const userId = req.user.id;
  const product = req.product;
  const productId = product.id;

  // likeCount 감소 작업
  const downProductLikeCount = product.likeCount - 1;

  const updateProductLikeCount = await prisma.product.update({
    where: { id: productId },
    data: { likeCount: Number(downProductLikeCount) },
  });

  const deleteProLikeId = req.proLikeId;

  // productLikes DB에서 삭제
  await prisma.productLikes.delete({
    where: { id: deleteProLikeId },
  });

  res.status(200).json({ updateProductLikeCount });
}
