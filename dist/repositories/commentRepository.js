import { prismaClient } from '../lib/prismaClient.js';
export class CommentRepository {
    async findById(id) {
        return prismaClient.comment.findUnique({ where: { id } });
    }
    async findByProductId(productId, query) {
        return prismaClient.comment.findMany({
            cursor: query.cursor ? { id: query.cursor } : undefined,
            take: query.limit + 1,
            where: { productId },
        });
    }
    async findByArticleId(articleId, query) {
        return prismaClient.comment.findMany({
            cursor: query.cursor ? { id: query.cursor } : undefined,
            take: query.limit + 1,
            where: { articleId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(data) {
        return prismaClient.comment.create({ data });
    }
    async update(id, data) {
        return prismaClient.comment.update({ where: { id }, data });
    }
    async delete(id) {
        await prismaClient.comment.delete({ where: { id } });
    }
}
export const commentRepository = new CommentRepository();
//# sourceMappingURL=commentRepository.js.map