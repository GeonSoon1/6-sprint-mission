import prisma from '../lib/prisma';

class UserRepository {
  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  updateById(id: number, data: any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  findMyProducts(userId: number) {
    return prisma.product.findMany({
      where: { userId },
    });
  }

  findLikedProductIds(userId: number) {
    return prisma.productLike.findMany({
      where: { userId },
      select: { productId: true },
    });
  }

  findProductsByIds(ids: number[]) {
    return prisma.product.findMany({
      where: { id: { in: ids } },
    });
  }
}

export default new UserRepository();
