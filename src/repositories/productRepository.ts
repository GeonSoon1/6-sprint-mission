import prisma from '../lib/prismaClient';

export function findProductsWithLikes() {
  return prisma.product.findMany({
    include: { likes: true },
    orderBy: { createdAt: 'desc' },
  });
}

export function findProductByIdWithLikes(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { likes: true },
  });
}

export function findProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
  });
}

export function createProduct(data: {
  name: string;
  description: string;
  price: number;
  tags: string;
  userId: string;
}) {
  return prisma.product.create({ data });
}

export function updateProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    tags?: string;
  }
) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  });
}

export function findMyProducts(userId: string) {
  return prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export function findProductLike(userId: string, productId: string) {
  return prisma.productLike.findFirst({
    where: { userId, productId },
  });
}

export function deleteProductLike(likeId: string) {
  return prisma.productLike.delete({
    where: { id: likeId },
  });
}

export function createProductLike(userId: string, productId: string) {
  return prisma.productLike.create({
    data: { userId, productId },
  });
}

export function countProductLikes(productId: string) {
  return prisma.productLike.count({
    where: { productId },
  });
}

export function findLikedProducts(userId: string) {
  return prisma.productLike.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });
}
