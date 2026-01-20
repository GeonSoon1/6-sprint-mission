import { Category } from '@prisma/client';
import productRepository from '../repository/productRepository';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';

class ProductService {
  getProducts(offset: number, limit: number, order: string, search: string) {
    const orderBy = order === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' };

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return productRepository.findMany(where, orderBy, offset, limit);
  }

  async createProduct(data: any, userId: number) {
    this.validateCategory(data.category);

    const { category, ...rest } = data;

    return productRepository.create({
      ...rest,
      category: category as Category,
      userId,
    });
  }

  async getProductById(id: number) {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError('해당 상품이 없습니다.');
    return product;
  }

  async updateProduct(id: number, data: any, userId: number) {
    this.validateCategory(data.category);

    const existing = await productRepository.findById(id);
    if (!existing) throw new NotFoundError('해당 상품이 없습니다.');
    if (existing.userId !== userId) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    const { category, ...rest } = data;

    return productRepository.update(id, {
      ...rest,
      category: category as Category,
    });
  }

  async deleteProduct(id: number, userId: number) {
    const existing = await productRepository.findById(id);
    if (!existing) throw new NotFoundError('해당 상품이 없습니다.');
    if (existing.userId !== userId) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    await productRepository.delete(id);
  }

  createComment(productId: number, content: string) {
    return productRepository.createComment(productId, content);
  }

  async getComments(productId: number, cursor: number | undefined, limit: number) {
    const comments = await productRepository.getComments(productId, cursor, limit);

    return {
      data: comments,
      nextCursor: comments.length > 0 ? comments[comments.length - 1].id : null,
    };
  }

  private validateCategory(category: unknown) {
    if (!Object.values(Category).includes(category as Category)) {
      throw new ForbiddenError('유효하지 않은 카테고리입니다.');
    }
  }
}

export default new ProductService();
