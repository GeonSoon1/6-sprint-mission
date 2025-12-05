import { Request, Response } from 'express';
import prisma from '../lib/prismaclient';

export async function createProduct(req: Request, res: Response) {
  // user 정보가 존재 하는지 확인
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const userId = req.user.id;

  const findUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!findUser) return res.status(401).json({ message: 'Unauthorized' });

  // product 저장하기
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
  const offset = Number(req.query.offset ?? 0);
  const limit = Number(req.query.limit ?? 10);
  const name = String(req.query.name ?? '');
  const description = String(req.query.description ?? '');
  const order = String(req.query.order ?? 'newest');

  let orderBy: { createdAt: 'asc' | 'desc' };
  switch (order) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    default:
      orderBy = { createdAt: 'asc' };
  }

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
    return res.status(401).json({ message: 'Cannot found List' });

  res.status(200).json(productList);
}

export async function getProductInfo(req: Request, res: Response) {
  const id = Number(req.params.id);
  const product = await prisma.product.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
    },
  });

  if (!product) return res.status(401).json({ message: `Cannot found ${id}` });

  // 현재 User가 좋아요 했는지 확인하기
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const userId = req.user.id;

  const checkLiked = await prisma.productLikes.findUnique({
    where: {
      userId_productId: {
        userId,
        productId: id,
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
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const userId = req.user.id;
  const productId = Number(req.params.id);

  // product가 DB에 있는지 확인
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product)
    return res.status(401).json({ message: 'Cannot found product' });

  // user가 DB에 존재 하는지 확인
  const findUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!findUser) return res.status(401).json({ message: 'Unauthorized' });

  // DB에 있는 product의 user정보가 로그인 한 user 인지 확인
  if (product.userId !== userId)
    return res.status(401).json({ message: 'Unauthorized' });

  // 업데이트 작업 진행
  const productUpdate = await prisma.product.update({
    where: { id: productId },
    data: req.body,
  });

  res.status(200).json(productUpdate);
}

export async function deleteProduct(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const userId = req.user.id;

  const productId = Number(req.params.id);

  // product가 DB에 있는지 확인
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product)
    return res.status(401).json({ message: 'Cannot found product' });

  // user가 DB에 존재 하는지 확인
  const findUser = await prisma.user.findUnique({ where: { id: userId } });

  if (!findUser) return res.status(401).json({ message: 'Unauthorized' });

  // 동일한 user 인지 확인
  if (product.userId !== userId)
    return res.status(401).json({ message: 'Unauthorized' });

  await prisma.product.delete({
    where: { id: productId },
  });

  res.status(204).json({ message: '삭제 완료' });
}
