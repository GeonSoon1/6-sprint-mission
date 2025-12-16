import { prismaClient } from '../lib/prismaClient.js';
export class LikeRepository {
    async findByArticleIdAndUserId(articleId, userId) {
        return prismaClient.like.findFirst({
            where: { articleId, userId },
        });
    }
    async create(data) {
        return prismaClient.like.create({ data });
    }
    async delete(id) {
        await prismaClient.like.delete({ where: { id } });
    }
}
export const likeRepository = new LikeRepository();
//# sourceMappingURL=likeRepository.js.map