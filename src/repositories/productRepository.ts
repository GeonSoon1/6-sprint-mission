import { prismaClient } from '../lib/prismaClient.js';
import { Product, Favorite } from '@prisma/client';
import { CreateProductDTO, UpdateProductDTO, ProductListQueryDTO } from '../types/dto.js';

export class ProductRepository {
  async findById(id: number): Promise<(Product & { favorites: Favorite[] }) | null> {
    return prismaClient.product.findUnique({
      where: { id },
      include: { favorites: true },
    });
  }

  async findMany(query: ProductListQueryDTO, userId?: number): Promise<(Product & { favorites: Favorite[] })[]> {
    const where = query.keyword
      ? {
          OR: [{ name: { contains: query.keyword } }, { description: { contains: query.keyword } }],
          ...(userId ? { userId } : {}),
        }
      : userId
        ? { userId }
        : {};

    return prismaClient.product.findMany({
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      orderBy: query.orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
      where,
      include: { favorites: true },
    });
  }

  async count(query: ProductListQueryDTO, userId?: number): Promise<number> {
    const where = query.keyword
      ? {
          OR: [{ name: { contains: query.keyword } }, { description: { contains: query.keyword } }],
          ...(userId ? { userId } : {}),
        }
      : userId
        ? { userId }
        : {};

    return prismaClient.product.count({ where });
  }

  async findUserFavorites(userId: number, query: ProductListQueryDTO): Promise<(Product & { favorites: Favorite[] })[]> {
    const where = query.keyword
      ? {
          OR: [{ name: { contains: query.keyword } }, { description: { contains: query.keyword } }],
          favorites: {
            some: {
              userId,
            },
          },
        }
      : {
          favorites: {
            some: {
              userId,
            },
          },
        };

    return prismaClient.product.findMany({
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      orderBy: query.orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
      where,
      include: { favorites: true },
    });
  }

  async countUserFavorites(userId: number, query: ProductListQueryDTO): Promise<number> {
    const where = query.keyword
      ? {
          OR: [{ name: { contains: query.keyword } }, { description: { contains: query.keyword } }],
          favorites: {
            some: {
              userId,
            },
          },
        }
      : {
          favorites: {
            some: {
              userId,
            },
          },
        };

    return prismaClient.product.count({ where });
  }

  async create(data: CreateProductDTO & { userId: number }): Promise<Product> {
    return prismaClient.product.create({ data });
  }

  async update(id: number, data: UpdateProductDTO): Promise<Product> {
    return prismaClient.product.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await prismaClient.product.delete({ where: { id } });
  }
}

export const productRepository = new ProductRepository();

