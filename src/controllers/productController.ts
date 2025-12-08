import { Prisma } from '@prisma/client';
import prisma from '../libs/prismaClient';
import { Request, Response, NextFunction } from 'express';

async function createProduct(req: Request, res: Response, next: NextFunction) {
  const data = await prisma.product.create({
    data: {
      ...req.validatedProductCreate!,
      userId: req.user!.id,
    },
  });
  res.status(201).json(data);
}

async function getProducts(req: Request, res: Response, next: NextFunction) {
  const {
    page = 1,
    limit = 10,
    search = '',
    sort = 'recent',
  } = req.validatedProductQuery!;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const orderBy: Prisma.ProductOrderByWithRelationInput = {
    createdAt: !sort || sort === 'recent' ? 'desc' : 'asc',
  };

  const data = await prisma.product.findMany({
    where,
    orderBy,
    skip,
    take: limit,
    select: {
      id: true,
      name: true,
      price: true,
      createdAt: true,
      productLikeCount: true,
    },
  });

  const userId = req.auth?.userId;
  if (userId) {
    const likedUser = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { likedProducts: true },
    });
    const likedProducts = likedUser.likedProducts.map((pid) => pid.productId);
    const filterlikedProducts = data
      .filter((d) => likedProducts.includes(d.id))
      .map((d) => {
        const liked = { ...d, isLiked: true };
        return liked;
      });
    const filterProducts = data
      .filter((d) => !likedProducts.includes(d.id))
      .map((d) => {
        const notLiked = { ...d, isLiked: false };
        return notLiked;
      });
    const userData = [...filterlikedProducts, ...filterProducts];
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

async function getProductById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.validatedId!;
  const data = await prisma.product.findUniqueOrThrow({
    where: { id: id! },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      tags: true,
      createdAt: true,
      productLikeCount: true,
    },
  });

  const userId = req.auth?.userId;
  if (userId) {
    const likedProduct = await prisma.likedProduct.findUnique({
      where: { userId_productId: { userId, productId: id! } },
    });
    if (likedProduct) {
      res.status(200).json({
        ...data,
        isLiked: true,
      });
    } else {
      res.status(200).json({
        ...data,
        isLiked: false,
      });
    }
  }

  res.status(200).json(data);
}

async function updateProduct(req: Request, res: Response, next: NextFunction) {
  const { id } = req.validatedId!;
  const data = await prisma.product.update({
    where: { id: id! },
    data: {
      ...Object.fromEntries(
        Object.entries(req.validatedProductUpdate!).filter(
          ([_, v]) => v !== undefined
        )
      ),
      userId: req.user!.id,
    },
  });
  res.status(200).json(data);
}

async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  const { id } = req.validatedId!;
  const data = await prisma.product.delete({
    where: { id: id! },
  });
  res.status(204).json(data);
}

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
