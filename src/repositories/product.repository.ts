import prisma from "../utils/prisma";
import { Product, ProductLike } from "@prisma/client";
import { CreateProductDto, UpdateProductDto } from "../dtos/product.dto";

export class ProductRepository {
  async create(userId: number, data: CreateProductDto): Promise<Product> {
    return prisma.product.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
  }

  async findMany(params: {
    skip: number;
    take: number;
    keyword?: string;
    orderBy?: "recent";
  }) {
    const { skip, take, keyword, orderBy } = params;

    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword, mode: "insensitive" as const } },
            {
              description: { contains: keyword, mode: "insensitive" as const },
            },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: orderBy === "recent" ? { createdAt: "desc" } : undefined,
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  async findByUserId(userId: number, skip: number, take: number) {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
      }),
      prisma.product.count({ where: { userId } }),
    ]);

    return { products, total };
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }

  async createLike(userId: number, productId: number): Promise<ProductLike> {
    return prisma.productLike.create({
      data: {
        userId,
        productId,
      },
    });
  }

  async deleteLike(userId: number, productId: number): Promise<void> {
    await prisma.productLike.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async findLike(
    userId: number,
    productId: number
  ): Promise<ProductLike | null> {
    return prisma.productLike.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async findLikedProducts(userId: number, skip: number, take: number) {
    const [likes, total] = await Promise.all([
      prisma.productLike.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            include: {
              user: {
                select: {
                  id: true,
                  nickname: true,
                },
              },
              _count: {
                select: {
                  likes: true, //
                },
              },
            },
          },
        },
      }),
      prisma.productLike.count({ where: { userId } }),
    ]);

    return { likes, total };
  }
}
