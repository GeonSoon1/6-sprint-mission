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

  createComment(productId: number, content: string) {
    return prisma.comment.create({
      data: {
        content,
        product: { connect: { id: productId } },
      },
      include: { product: true },
    });
  }

  getComments(productId: number, cursor: number | undefined, limit: number) {
    return prisma.comment.findMany({
      where: { productId },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      take: limit,
      ...(cursor
        ? {
            skip: 1,
            cursor: { id: cursor },
          }
        : {}),
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default new ProductRepository();
