import { prismaClient } from '../lib/prismaClient.js';
export class ProductRepository {
    async findById(id) {
        return prismaClient.product.findUnique({
            where: { id },
            include: { favorites: true },
        });
    }
    async findMany(query, userId) {
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
    async count(query, userId) {
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
    async findUserFavorites(userId, query) {
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
    async countUserFavorites(userId, query) {
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
    async create(data) {
        return prismaClient.product.create({ data });
    }
    async update(id, data) {
        return prismaClient.product.update({ where: { id }, data });
    }
    async delete(id) {
        await prismaClient.product.delete({ where: { id } });
    }
}
export const productRepository = new ProductRepository();
//# sourceMappingURL=productRepository.js.map