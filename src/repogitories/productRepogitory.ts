import { Prisma } from '@prisma/client';
import { ProductCreateDto, ProductQueryDto } from '../dto/productDto';
import prisma from '../libs/prismaClient';
import { string } from 'superstruct';

export class ProductRepository {
  async create(data: ProductCreateDto) {
    return prisma.product.create({ data });
  }
  async findAll(query: ProductQueryDto) {
    const skip = (query.page - 1) * query.limit;

    const where: Prisma.ProductWhereInput = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      createdAt: query.sort === 'recent' ? 'desc' : 'asc',
    };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: query.limit,
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
        productLikeCount: true,
      },
    });

    return products;
  }

  async findLikedProductsByUser(userId: string) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { likedProducts: true },
    });
    return user.likedProducts.map((p) => p.productId);
  }

  async findById(id: string) {
    return prisma.product.findUniqueOrThrow({
      where: { id },
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
  }

  async findLikedByUser(userId: string, productId: string) {
    return prisma.likedProduct.findUnique({
      where: { userId_productId: { userId, productId } },
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.product.delete({ where: { id } });
  }
}
