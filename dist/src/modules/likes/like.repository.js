"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeRepository = void 0;
const prismaClient_1 = __importDefault(require("../../libs/prismaClient"));
class LikeRepository {
    // Product Like
    async productFindProductById(productId) {
        return prismaClient_1.default.product.findUniqueOrThrow({ where: { id: productId } });
    }
    async productFindExistingLike(userId, productId) {
        return prismaClient_1.default.likedProduct.findUnique({
            where: { userId_productId: { userId, productId } },
        });
    }
    async productCreateLike(userId, productId) {
        return prismaClient_1.default.likedProduct.create({ data: { userId, productId } });
    }
    async productDeleteLike(userId, productId) {
        return prismaClient_1.default.likedProduct.delete({
            where: { userId_productId: { userId, productId } },
        });
    }
    async productIncrementLike(productId) {
        return prismaClient_1.default.product.update({
            where: { id: productId },
            data: { productLikeCount: { increment: 1 } },
        });
    }
    async productDecrementLike(productId) {
        return prismaClient_1.default.product.update({
            where: { id: productId, productLikeCount: { gt: 0 } },
            data: { productLikeCount: { decrement: 1 } },
        });
    }
    async getLikedProducts(userId) {
        return prismaClient_1.default.user.findUniqueOrThrow({
            where: { id: userId },
            select: {
                likedProducts: {
                    select: { product: true },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }
    // Article Like
    async articleFindArticleById(articleId) {
        return prismaClient_1.default.article.findUniqueOrThrow({ where: { id: articleId } });
    }
    async articleFindExistingLike(userId, articleId) {
        return prismaClient_1.default.likedArticle.findUnique({
            where: { userId_articleId: { userId, articleId } },
        });
    }
    async articleCreateLike(userId, articleId) {
        return prismaClient_1.default.likedArticle.create({ data: { userId, articleId } });
    }
    async articleDeleteLike(userId, articleId) {
        return prismaClient_1.default.likedArticle.delete({
            where: { userId_articleId: { userId, articleId } },
        });
    }
    async articleIncrementLike(articleId) {
        return prismaClient_1.default.article.update({
            where: { id: articleId },
            data: { articleLikeCount: { increment: 1 } },
        });
    }
    async articleDecrementLike(articleId) {
        return prismaClient_1.default.article.update({
            where: { id: articleId, articleLikeCount: { gt: 0 } },
            data: { articleLikeCount: { decrement: 1 } },
        });
    }
    async getLikedArticles(userId) {
        return prismaClient_1.default.user.findUniqueOrThrow({
            where: { id: userId },
            select: {
                likedArticles: {
                    select: { article: true },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }
}
exports.LikeRepository = LikeRepository;
//# sourceMappingURL=like.repository.js.map