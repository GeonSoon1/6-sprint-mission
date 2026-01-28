import prisma from '../lib/prisma';
import { Category } from '@prisma/client';

class ProductRepository {
  findMany(where: object, orderBy: object, offset: number, limit: number) {
    return prisma.product.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
    });
  }

  create(data: any) {
    return prisma.product.create({ data });
  }

  findById(id: number) {
    return prisma.product.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  delete(id: number) {
    return prisma.product.delete({ where: { id } });
  }

  async findWatchers(productId: number): Promise<number[]> {
    // 상품을 구독하거나 관심 등록한 유저들의 ID를 조회하는 로직
    const watchers = await prisma.productLike.findMany({
      where: { productId },
      select: { userId: true },
    });
    return watchers.map((w) => w.userId);
  }
}

export default new ProductRepository();
