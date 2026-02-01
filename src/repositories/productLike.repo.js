import { prisma } from "../lib/prisma.js";

export function createProductLike(userId, productId) {
  return prisma.productLike.create({
    data: { userId, productId },
  });
}

export function deleteProductLike(userId, productId) {
  return prisma.productLike.delete({
    where: { userId_productId: { userId, productId } },
  });
}

export function findProductLike(userId, productId) {
  return prisma.productLike.findUnique({
    where: { userId_productId: { userId, productId } },
  });
}

export function findLikedProductsByUser(userId) {
  return prisma.productLike.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      product: true,
    },
  });
}

export function findLikerUserIds(productId) {
  return prisma.productLike.findMany({
    where: { productId },
    select: { userId: true },
  });
}