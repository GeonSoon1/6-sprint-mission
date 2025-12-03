import { prismaClient } from '../lib/prismaClient.js';
export class FavoriteRepository {
    async findByProductIdAndUserId(productId, userId) {
        return prismaClient.favorite.findFirst({
            where: { productId, userId },
        });
    }
    async create(data) {
        return prismaClient.favorite.create({ data });
    }
    async delete(id) {
        await prismaClient.favorite.delete({ where: { id } });
    }
}
export const favoriteRepository = new FavoriteRepository();
//# sourceMappingURL=favoriteRepository.js.map