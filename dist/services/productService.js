import { productRepository } from '../repositories/productRepository.js';
import { commentRepository } from '../repositories/commentRepository.js';
import { favoriteRepository } from '../repositories/favoriteRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
export class ProductService {
    async createProduct(userId, data) {
        return productRepository.create({ ...data, userId });
    }
    async getProduct(id, userId) {
        const product = await productRepository.findById(id);
        if (!product) {
            throw new NotFoundError('product', id);
        }
        const { favorites, ...productWithoutFavorites } = product;
        return {
            ...productWithoutFavorites,
            favoriteCount: favorites.length,
            isFavorited: userId
                ? favorites.some((favorite) => favorite.userId === userId)
                : undefined,
        };
    }
    async updateProduct(id, userId, data) {
        const existingProduct = await productRepository.findById(id);
        if (!existingProduct) {
            throw new NotFoundError('product', id);
        }
        if (existingProduct.userId !== userId) {
            throw new ForbiddenError('Should be the owner of the product');
        }
        return productRepository.update(id, data);
    }
    async deleteProduct(id, userId) {
        const existingProduct = await productRepository.findById(id);
        if (!existingProduct) {
            throw new NotFoundError('product', id);
        }
        if (existingProduct.userId !== userId) {
            throw new ForbiddenError('Should be the owner of the product');
        }
        await productRepository.delete(id);
    }
    async getProductList(query, userId) {
        const totalCount = await productRepository.count(query, userId);
        const products = await productRepository.findMany(query, userId);
        const productsWithFavorites = products.map((product) => {
            const { favorites, ...productWithoutFavorites } = product;
            return {
                ...productWithoutFavorites,
                favoriteCount: favorites.length,
                isFavorited: userId
                    ? favorites.some((favorite) => favorite.userId === userId)
                    : undefined,
            };
        });
        return {
            list: productsWithFavorites,
            totalCount,
        };
    }
    async createComment(productId, userId, data) {
        const existingProduct = await productRepository.findById(productId);
        if (!existingProduct) {
            throw new NotFoundError('product', productId);
        }
        return commentRepository.create({ ...data, userId, productId });
    }
    async getCommentList(productId, query) {
        const existingProduct = await productRepository.findById(productId);
        if (!existingProduct) {
            throw new NotFoundError('product', productId);
        }
        const commentsWithCursor = await commentRepository.findByProductId(productId, query);
        const comments = commentsWithCursor.slice(0, query.limit);
        const cursorComment = commentsWithCursor[comments.length - 1];
        const nextCursor = cursorComment ? cursorComment.id : null;
        return {
            list: comments,
            nextCursor,
        };
    }
    async createFavorite(productId, userId) {
        const existingProduct = await productRepository.findById(productId);
        if (!existingProduct) {
            throw new NotFoundError('product', productId);
        }
        const existingFavorite = await favoriteRepository.findByProductIdAndUserId(productId, userId);
        if (existingFavorite) {
            throw new BadRequestError('Already favorited');
        }
        await favoriteRepository.create({ productId, userId });
    }
    async deleteFavorite(productId, userId) {
        const existingFavorite = await favoriteRepository.findByProductIdAndUserId(productId, userId);
        if (!existingFavorite) {
            throw new BadRequestError('Not favorited');
        }
        await favoriteRepository.delete(existingFavorite.id);
    }
}
export const productService = new ProductService();
//# sourceMappingURL=productService.js.map