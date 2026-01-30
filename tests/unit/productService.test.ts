import * as productsService from '../../src/services/productsService.js';
import * as productsRepository from '../../src/repositories/productsRepository.js';
import * as usersRepository from '../../src/repositories/usersRepository.js';
import * as notificationsService from '../../src/services/notificationsService.js';
import * as favoritesRepository from '../../src/repositories/favoritesRepository.js';
import NotFoundError from '../../src/lib/errors/NotFoundError.js';
import ForbiddenError from '../../src/lib/errors/ForbiddenError.js';

describe('ProductService - 유닛 테스트 (Mock, Spy 활용)', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('createProduct', () => {
    it('상품을 생성하고 기본값을 설정한다', async () => {
      const mockProductData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        tags: ['tag1'],
        images: ['image1.jpg'],
        userId: 1,
      };

      const mockCreatedProduct = {
        id: 1,
        ...mockProductData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createSpy = jest
        .spyOn(productsRepository, 'createProduct')
        .mockResolvedValue(mockCreatedProduct);

      const result = await productsService.createProduct(mockProductData);

      expect(createSpy).toHaveBeenCalledWith(mockProductData);
      expect(result).toMatchObject({
        id: 1,
        name: 'Test Product',
        favoriteCount: 0,
        isFavorited: false,
      });
    });
  });

  describe('getProduct', () => {
    it('상품을 조회한다', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        tags: [],
        images: [],
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        favorites: undefined,
        favoriteCount: 5,
        isFavorited: true,
      };

      jest.spyOn(productsRepository, 'getProductWithFavorites').mockResolvedValue(mockProduct);

      const result = await productsService.getProduct(1);

      expect(productsRepository.getProductWithFavorites).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('존재하지 않는 상품 조회 시 NotFoundError를 발생시킨다', async () => {
      jest.spyOn(productsRepository, 'getProductWithFavorites').mockResolvedValue(null);

      await expect(productsService.getProduct(999)).rejects.toThrow(NotFoundError);
      await expect(productsService.getProduct(999)).rejects.toThrow('product with id 999 not found');
    });
  });

  describe('getProductList', () => {
    it('상품 목록을 조회한다', async () => {
      const mockParams = { page: 1, pageSize: 10 };
      const mockResult = {
        list: [
          {
            id: 1,
            name: 'Product 1',
            description: 'Description',
            price: 100,
            tags: [],
            images: [],
            userId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            favorites: undefined,
            favoriteCount: 0,
            isFavorited: false,
          },
        ],
        totalCount: 1,
      };

      const getListSpy = jest
        .spyOn(productsRepository, 'getProductListWithFavorites')
        .mockResolvedValue(mockResult);

      const result = await productsService.getProductList(mockParams, { userId: 1 });

      expect(getListSpy).toHaveBeenCalledWith(mockParams, { userId: 1 });
      expect(result).toEqual(mockResult);
    });

    it('userId 없이 상품 목록을 조회할 수 있다', async () => {
      const mockParams = { page: 1, pageSize: 10 };
      const mockResult = { list: [], totalCount: 0 };

      jest
        .spyOn(productsRepository, 'getProductListWithFavorites')
        .mockResolvedValue(mockResult);

      const result = await productsService.getProductList(mockParams);

      expect(productsRepository.getProductListWithFavorites).toHaveBeenCalledWith(mockParams, {
        userId: undefined,
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateProduct', () => {
    it('userId가 유효하지 않으면 NotFoundError를 발생시킨다', async () => {
      jest.spyOn(usersRepository, 'userExists').mockResolvedValue(false);

      await expect(
        productsService.updateProduct(1, { userId: 999, price: 100 }),
      ).rejects.toThrow(NotFoundError);
      await expect(
        productsService.updateProduct(1, { userId: 999, price: 100 }),
      ).rejects.toThrow('user with id 999 not found');

      expect(usersRepository.userExists).toHaveBeenCalledWith(999);
    });

    it('상품이 존재하지 않으면 NotFoundError를 발생시킨다', async () => {
      jest.spyOn(usersRepository, 'userExists').mockResolvedValue(true);
      jest.spyOn(productsRepository, 'getProduct').mockResolvedValue(null);

      await expect(
        productsService.updateProduct(999, { userId: 1, price: 100 }),
      ).rejects.toThrow(NotFoundError);
      await expect(
        productsService.updateProduct(999, { userId: 1, price: 100 }),
      ).rejects.toThrow('product with id 999 not found');
    });

    it('다른 사용자의 상품 수정 시 ForbiddenError를 발생시킨다', async () => {
      jest.spyOn(usersRepository, 'userExists').mockResolvedValue(true);
      jest.spyOn(productsRepository, 'getProduct').mockResolvedValue({
        id: 1,
        userId: 2, // 다른 사용자
        name: 'Product',
        price: 100,
      } as never);

      await expect(
        productsService.updateProduct(1, { userId: 1, price: 100 }),
      ).rejects.toThrow(ForbiddenError);
      await expect(
        productsService.updateProduct(1, { userId: 1, price: 100 }),
      ).rejects.toThrow('Should be the owner of the product');
    });

    it('가격이 변경되면 즐겨찾기한 사용자들에게 알림을 보낸다', async () => {
      jest.spyOn(usersRepository, 'userExists').mockResolvedValue(true);
      jest.spyOn(productsRepository, 'getProduct').mockResolvedValue({
        id: 1,
        name: 'Product',
        price: 100,
        userId: 1,
      } as never);
      jest.spyOn(productsRepository, 'updateProductWithFavorites').mockResolvedValue({
        id: 1,
        name: 'Product',
        price: 200,
        userId: 1,
        favoriteCount: 2,
        isFavorited: false,
        tags: [],
        images: [],
        description: 'Desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);
      const notifySpy = jest
        .spyOn(notificationsService, 'notifyPriceChange')
        .mockResolvedValue();
      jest.spyOn(favoritesRepository, 'getFavoriteUserIdsByProductId').mockResolvedValue([2, 3]);

      await productsService.updateProduct(1, { userId: 1, price: 200 });

      expect(notifySpy).toHaveBeenCalledWith([2, 3], 1, 'Product', 100, 200);
      expect(favoritesRepository.getFavoriteUserIdsByProductId).toHaveBeenCalledWith(1);
    });

    it('가격이 변경되지 않으면 알림을 보내지 않는다', async () => {
      jest.spyOn(usersRepository, 'userExists').mockResolvedValue(true);
      jest.spyOn(productsRepository, 'getProduct').mockResolvedValue({
        id: 1,
        name: 'Product',
        price: 100,
        userId: 1,
      } as never);
      jest.spyOn(productsRepository, 'updateProductWithFavorites').mockResolvedValue({
        id: 1,
        name: 'Product',
        price: 100,
        userId: 1,
        favoriteCount: 1,
        isFavorited: false,
        tags: [],
        images: [],
        description: 'Desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);
      const notifySpy = jest
        .spyOn(notificationsService, 'notifyPriceChange')
        .mockResolvedValue();

      await productsService.updateProduct(1, { userId: 1, price: 100 });

      expect(notifySpy).not.toHaveBeenCalled();
    });

    it('가격 필드가 없으면 알림을 보내지 않는다', async () => {
      jest.spyOn(usersRepository, 'userExists').mockResolvedValue(true);
      jest.spyOn(productsRepository, 'getProduct').mockResolvedValue({
        id: 1,
        name: 'Product',
        price: 100,
        userId: 1,
      } as never);
      jest.spyOn(productsRepository, 'updateProductWithFavorites').mockResolvedValue({
        id: 1,
        name: 'Updated Product',
        price: 100,
        userId: 1,
        favoriteCount: 0,
        isFavorited: false,
        tags: [],
        images: [],
        description: 'Desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);
      const notifySpy = jest
        .spyOn(notificationsService, 'notifyPriceChange')
        .mockResolvedValue();

      await productsService.updateProduct(1, { userId: 1, name: 'Updated Product' });

      expect(notifySpy).not.toHaveBeenCalled();
    });

    it('상품 수정에 성공하면 업데이트된 상품을 반환한다', async () => {
      jest.spyOn(usersRepository, 'userExists').mockResolvedValue(true);
      jest.spyOn(productsRepository, 'getProduct').mockResolvedValue({
        id: 1,
        name: 'Product',
        price: 100,
        userId: 1,
      } as never);
      const mockUpdatedProduct = {
        id: 1,
        name: 'Updated Product',
        price: 150,
        userId: 1,
        favoriteCount: 0,
        isFavorited: false,
        tags: [],
        images: [],
        description: 'Updated Description',
        createdAt: new Date(),
        updatedAt: new Date(),
        favorites: undefined,
      };
      jest
        .spyOn(productsRepository, 'updateProductWithFavorites')
        .mockResolvedValue(mockUpdatedProduct);

      const result = await productsService.updateProduct(1, { userId: 1, price: 150 });

      expect(result).toEqual(mockUpdatedProduct);
      expect(productsRepository.updateProductWithFavorites).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ userId: 1, price: 150 }),
      );
    });
  });

  describe('deleteProduct', () => {
    it('userId가 유효하지 않으면 NotFoundError를 발생시킨다', async () => {
      jest.spyOn(usersRepository, 'userExists').mockResolvedValue(false);

      await expect(productsService.deleteProduct(1, 999)).rejects.toThrow(NotFoundError);
      await expect(productsService.deleteProduct(1, 999)).rejects.toThrow(
        'user with id 999 not found',
      );

      expect(usersRepository.userExists).toHaveBeenCalledWith(999);
    });

    it('상품이 존재하지 않으면 NotFoundError를 발생시킨다', async () => {
      jest.spyOn(usersRepository, 'userExists').mockResolvedValue(true);
      jest.spyOn(productsRepository, 'getProduct').mockResolvedValue(null);

      await expect(productsService.deleteProduct(999, 1)).rejects.toThrow(NotFoundError);
      await expect(productsService.deleteProduct(999, 1)).rejects.toThrow(
        'product with id 999 not found',
      );
    });

    it('다른 사용자의 상품 삭제 시 ForbiddenError를 발생시킨다', async () => {
      jest.spyOn(usersRepository, 'userExists').mockResolvedValue(true);
      jest.spyOn(productsRepository, 'getProduct').mockResolvedValue({
        id: 1,
        userId: 2, // 다른 사용자
      } as never);

      await expect(productsService.deleteProduct(1, 1)).rejects.toThrow(ForbiddenError);
      await expect(productsService.deleteProduct(1, 1)).rejects.toThrow(
        'Should be the owner of the product',
      );
    });

    it('상품 삭제에 성공한다', async () => {
      jest.spyOn(usersRepository, 'userExists').mockResolvedValue(true);
      jest.spyOn(productsRepository, 'getProduct').mockResolvedValue({
        id: 1,
        userId: 1,
        name: 'Product',
        description: 'Description',
        price: 100,
        tags: [],
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);
      const deleteSpy = jest
        .spyOn(productsRepository, 'deleteProduct')
        .mockResolvedValue({
          id: 1,
          userId: 1,
          name: 'Product',
          description: 'Description',
          price: 100,
          tags: [],
          images: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        } as never);

      await productsService.deleteProduct(1, 1);

      expect(deleteSpy).toHaveBeenCalledWith(1);
    });
  });
});
