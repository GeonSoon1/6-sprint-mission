import { Request, Response } from 'express';
import prisma from '../lib/prismaclient';
import { QueryList } from '../types/express/query.types';

export async function createProduct(req: Request, res: Response) {
  const userId = req.userId;
  const { name, description, price, tags } = req.body;

  const productCreate = await prisma.product.create({
    data: {
      name,
      description,
      price,
      tags,
      userId,
    },
    include: {
      comments: true,
    },
  });

  res.status(201).json(productCreate);
}

export async function getProductsList(req: Request, res: Response) {
  const { offset, limit, name, description, orderBy } =
    req.validated as QueryList;

  const productList = await prisma.product.findMany({
    where: {
      name: { contains: name },
      description: { contains: description },
    },
    skip: offset,
    take: limit,
    orderBy,
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
    },
  });

  if (!productList)
    return res.status(401).json({ message: '제품 목록을 찾을 수 없습니다' });

  res.status(200).json(productList);
}

export async function getProductInfo(req: Request, res: Response) {
  const productId = req.product.id;
  const product = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
    },
  });

  // 현재 User가 좋아요 했는지 확인하기
  const userId = req.userId;

  const checkLiked = await prisma.productLikes.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  let isLiked = false;
  if (checkLiked) {
    isLiked = true;
  }

  res.status(200).json({ product, isLiked });
}

export async function updateProduct(req: Request, res: Response) {
  const productId = req.product.id;

  const productUpdate = await prisma.product.update({
    where: { id: productId },
    data: req.body,
  });

  res.status(200).json(productUpdate);
}

export async function deleteProduct(req: Request, res: Response) {
  const productId = req.product.id;

  await prisma.product.delete({
    where: { id: productId },
  });

  res.status(204).json({ message: '삭제 완료' });
}
