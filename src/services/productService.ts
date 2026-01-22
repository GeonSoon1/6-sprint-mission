import { Comment } from '@prisma/client';
import { productRepository } from '../repositories/productRepository';
import { commentRepository } from '../repositories/commentRepository';
import { favoriteRepository } from '../repositories/favoriteRepository';
import { notificationService } from './notificationService';
import { NOTIFICATION_TYPES } from '../types/notification';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import BadRequestError from '../lib/errors/BadRequestError';
import {
  CreateProductDTO,
  UpdateProductDTO,
  ProductListQueryDTO,
  ProductResponseDTO,
  CreateCommentDTO,
  CommentListQueryDTO,
} from '../types/dto';

export class ProductService {
  async createProduct(userId: number, data: CreateProductDTO) {
    return productRepository.create({ ...data, userId });
  }

  async getProduct(id: number, userId?: number): Promise<ProductResponseDTO> {
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

  async updateProduct(id: number, userId: number, data: UpdateProductDTO) {
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundError('product', id);
    }

    if (existingProduct.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the product');
    }

    const priceChanged = data.price !== undefined && data.price !== existingProduct.price;
    const updatedProduct = await productRepository.update(id, data);

    if (priceChanged) {
      const userIds = existingProduct.favorites.map((favorite) => favorite.userId);
      await notificationService.createNotificationsForUsers(userIds, {
        type: NOTIFICATION_TYPES.PRICE_CHANGED,
        content: `Price changed for ${existingProduct.name}.`,
        productId: existingProduct.id,
      });
    }

    return updatedProduct;
  }

  async deleteProduct(id: number, userId: number): Promise<void> {
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundError('product', id);
    }

    if (existingProduct.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the product');
    }

    await productRepository.delete(id);
  }

  async getProductList(query: ProductListQueryDTO, userId?: number): Promise<{ list: ProductResponseDTO[]; totalCount: number }> {
    const totalCount = await productRepository.count(query, userId);
    const products = await productRepository.findMany(query, userId);

    const productsWithFavorites: ProductResponseDTO[] = products.map((product) => {
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

  async createComment(productId: number, userId: number, data: CreateCommentDTO) {
    const existingProduct = await productRepository.findById(productId);
    if (!existingProduct) {
      throw new NotFoundError('product', productId);
    }

    return commentRepository.create({ ...data, userId, productId });
  }

  async getCommentList(productId: number, query: CommentListQueryDTO): Promise<{ list: Comment[]; nextCursor: number | null }> {
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

  async createFavorite(productId: number, userId: number): Promise<void> {
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

  async deleteFavorite(productId: number, userId: number): Promise<void> {
    const existingFavorite = await favoriteRepository.findByProductIdAndUserId(productId, userId);
    if (!existingFavorite) {
      throw new BadRequestError('Not favorited');
    }

    await favoriteRepository.delete(existingFavorite.id);
  }
}

export const productService = new ProductService();

