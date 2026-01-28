import { Category } from '@prisma/client';
import productRepository from '../repository/productRepository';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import notificationService from './notificationService';
import { notifyUser } from '../socket/socketServer';

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

    const oldPrice = existing.price;
    const newPrice = data.price;
    const { category, ...rest } = data;

    const updatedProduct = await productRepository.update(id, {
      ...rest,
      category: category as Category,
    });

    // 가격이 실제로 바뀐 경우만 알림
    if (typeof newPrice === 'number' && newPrice !== oldPrice) {
      await this.notifyPriceChanged(updatedProduct);
    }

    return updatedProduct;
  }

  async deleteProduct(id: number, userId: number) {
    const existing = await productRepository.findById(id);
    if (!existing) throw new NotFoundError('해당 상품이 없습니다.');
    if (existing.userId !== userId) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    await productRepository.delete(id);
  }

  private validateCategory(category: unknown) {
    if (category === undefined) return;
    if (!Object.values(Category).includes(category as Category)) {
      throw new ForbiddenError('유효하지 않은 카테고리입니다.');
    }
  }
  private async notifyPriceChanged(product: any) {
    // 이 상품을 구독 / 관심 등록한 유저들 조회
    const targetUserIds = await productRepository.findWatchers(product.id);

    for (const userId of targetUserIds) {
      // DB 알림 생성
      const notification = await notificationService.notifyPriceChanged(product.id, userId);

      // 실시간 소켓 알림
      notifyUser(userId, 'notification', {
        id: notification.id,
        type: notification.type,
        productId: product.id,
        price: product.price,
      });
    }
  }
}

export default new ProductService();
