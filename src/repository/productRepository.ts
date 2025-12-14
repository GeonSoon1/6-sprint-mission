import { Prisma } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';

export const productRepository = {
  create(data: Prisma.ProductUncheckedCreateInput) {
    return prismaClient.product.create({ data });
  },

  findById(id: number) {
    return prismaClient.product.findUnique({ where: { id } });
  },

  update(id: number, data: Prisma.ProductUncheckedUpdateInput) {
    return prismaClient.product.update({ where: { id }, data });
  },

  delete(id: number) {
    return prismaClient.product.delete({ where: { id } });
  },

  findList({ skip, take, orderBy, where }: Prisma.ProductFindManyArgs) {
    return prismaClient.product.findMany({
      skip,
      take,
      orderBy,
      where,
    });
  },

  isLiked(userId: number, productId: number) {
    return prismaClient.likeProduct.findFirst({
      where: { userId: userId, productId: productId },
    });
  },

  likeProduct(userId: number, productId: number) {
    return prismaClient.likeProduct.create({ data: { userId, productId: productId } });
  },

  dislikeProduct(productId: number) {
    return prismaClient.likeProduct.delete({
      where: { id: productId },
    });
  },
};
