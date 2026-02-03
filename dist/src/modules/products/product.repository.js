"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const prismaClient_1 = __importDefault(require("../../libs/prismaClient"));
class ProductRepository {
    async create(data) {
        return prismaClient_1.default.product.create({ data });
    }
    async findAll(query) {
        const skip = (query.page - 1) * query.limit;
        const where = query.search
            ? {
                OR: [
                    { name: { contains: query.search, mode: 'insensitive' } },
                    { description: { contains: query.search, mode: 'insensitive' } },
                ],
            }
            : {};
        const orderBy = {
            createdAt: query.sort === 'recent' ? 'desc' : 'asc',
        };
        const products = await prismaClient_1.default.product.findMany({
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
    async findLikedProductsByUser(userId) {
        const user = await prismaClient_1.default.user.findUniqueOrThrow({
            where: { id: userId },
            include: { likedProducts: true },
        });
        return user.likedProducts.map((p) => p.productId);
    }
    async findById(id) {
        return prismaClient_1.default.product.findUniqueOrThrow({
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
    async findLikedByUser(userId, productId) {
        return prismaClient_1.default.likedProduct.findUnique({
            where: { userId_productId: { userId, productId } },
        });
    }
    async update(id, data) {
        return prismaClient_1.default.product.update({ where: { id }, data });
    }
    async delete(id) {
        return prismaClient_1.default.product.delete({ where: { id } });
    }
    async findByUserId(userId) {
        return prismaClient_1.default.product.findMany({ where: { userId } });
    }
    async findLikers(productId) {
        const likes = await prismaClient_1.default.likedProduct.findMany({
            where: { productId },
            select: { userId: true },
        });
        return likes.map((like) => like.userId);
    }
}
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=product.repository.js.map