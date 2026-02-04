import { mock, MockProxy } from 'jest-mock-extended';
import { ProductService } from '../../src/modules/products/product.service';
import { ProductRepository } from '../../src/modules/products/product.repository';
import { NotificationService } from '../../src/modules/notifications/notification.service';
import { Product } from '@prisma/client';

describe('ProductService Unit Test', () => {
  let service: ProductService;
  let repo: MockProxy<ProductRepository>;
  let notiService: MockProxy<NotificationService>;

  beforeEach(() => {
    repo = mock<ProductRepository>();
    notiService = mock<NotificationService>();

    service = new ProductService(repo, notiService);
  });

  describe('update', () => {
    const productId = 'product-1';
    const oldPrice = 10000;
    const oldProduct = {
      id: productId,
      name: 'Old Product',
      description: 'Old Description',
      price: oldPrice,
      tags: ['old'],
      userId: 'test-user-id',
      productLikeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Product;

    it('가격이 변경되면 관심 등록한 유저들에게 알림을 발송해야 한다', async () => {
      const newPrice = 8000;
      const likerIds = ['user-1', 'user-2'];

      repo.findById.mockResolvedValue(oldProduct);
      repo.update.mockResolvedValue({ ...oldProduct, price: newPrice });
      repo.findLikers.mockResolvedValue(likerIds);
      notiService.create.mockResolvedValue({} as any);

      await service.update(productId, {
        price: newPrice,
        userId: 'test-user-id',
      });

      expect(repo.findById).toHaveBeenCalledWith(productId);
      expect(repo.update).toHaveBeenCalledWith(productId, {
        price: newPrice,
        userId: 'test-user-id',
      });
      expect(repo.findLikers).toHaveBeenCalledWith(productId);

      expect(notiService.create).toHaveBeenCalledTimes(likerIds.length);
      expect(notiService.create).toHaveBeenCalledWith(
        likerIds[0],
        expect.stringContaining('8000원')
      );
      expect(notiService.create).toHaveBeenCalledWith(
        likerIds[1],
        expect.stringContaining('8000원')
      );
    });

    it('가격이 변경되지 않으면 알림을 발송하지 않아야 한다', async () => {
      const samePrice = 10000;

      repo.findById.mockResolvedValue(oldProduct);
      repo.update.mockResolvedValue({ ...oldProduct, price: samePrice });

      await service.update(productId, {
        price: samePrice,
        userId: 'test-user-id',
      });

      expect(repo.update).toHaveBeenCalledWith(productId, {
        price: samePrice,
        userId: 'test-user-id',
      });
      expect(repo.findLikers).not.toHaveBeenCalled();
      expect(notiService.create).not.toHaveBeenCalled();
    });
  });
});
