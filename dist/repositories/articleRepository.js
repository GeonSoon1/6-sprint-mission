import { prismaClient } from '../lib/prismaClient.js';
export class ArticleRepository {
    async findById(id) {
        return prismaClient.article.findUnique({
            where: { id },
            include: { likes: true },
        });
    }
    async findMany(query) {
        const where = {
            title: query.keyword ? { contains: query.keyword } : undefined,
        };
        return prismaClient.article.findMany({
            skip: (query.page - 1) * query.pageSize,
            take: query.pageSize,
            orderBy: query.orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
            where,
            include: { likes: true },
        });
    }
    async count(query) {
        const where = {
            title: query.keyword ? { contains: query.keyword } : undefined,
        };
        return prismaClient.article.count({ where });
    }
    async create(data) {
        return prismaClient.article.create({ data });
    }
    async update(id, data) {
        return prismaClient.article.update({ where: { id }, data });
    }
    async delete(id) {
        await prismaClient.article.delete({ where: { id } });
    }
}
export const articleRepository = new ArticleRepository();
//# sourceMappingURL=articleRepository.js.map