import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductList,
  updateProduct,
} from '@service/product.service';
import * as productsRepository from '@/repository/product.repo';
import * as favoriteRepository from '@repository/favorite.repo';
import * as notificationRepository from '@repository/notification.repo';
import * as websocket from '@lib/websocket';
import NotFoundError from '@lib/errors/NotFoundError';
import ForbiddenError from '@lib/errors/ForbiddenError';

// 사용하는 모든 외부 모듈을 Mocking
jest.mock('@repository/product.repo');
jest.mock('@repository/favorite.repo');
jest.mock('@repository/notification.repo');
jest.mock('@lib/websocket');

describe('Product Service Unit Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------------------------------------------------------
  // 1. CREATE
  // ---------------------------------------------------------
  describe('createProduct', () => {
    test('상품 생성 및 초기 데이터 출력', async () => {
      const mockInput = {
        name: 'New Product',
        description: 'Desc',
        price: 100,
        tags: [],
        images: [],
        userId: 1,
      };
      const mockOutput = {
        id: 1,
        ...mockInput,
        createdAt: new Date(),
        updatedAt: new Date(),
        favoriteCount: 0,
      };

      (productsRepository.createProduct as jest.Mock).mockResolvedValue(mockOutput);

      const result = await createProduct(mockInput);

      expect(productsRepository.createProduct).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual({ ...mockOutput, favoriteCount: 0, isFavorited: false });
    });
  });

  // ---------------------------------------------------------
  // 2. GET - Detail
  // ---------------------------------------------------------
  describe('getProduct', () => {
    test('상품 세부 정보 조회', async () => {
      const mockProduct = { id: 1, name: 'Product' };
      (productsRepository.getProductWithFavorites as jest.Mock).mockResolvedValue(mockProduct);

      const result = await getProduct(1);
      expect(result).toEqual(mockProduct);
    });

    it('조회 오류 : 잘못된 상품 Id', async () => {
      (productsRepository.getProductWithFavorites as jest.Mock).mockResolvedValue(null);
      await expect(getProduct(999)).rejects.toThrow(NotFoundError);
    });
  });

  // ---------------------------------------------------------
  // 2. GET - List
  // ---------------------------------------------------------
  describe('getProductList', () => {
    test('상품 리스트 조회 : query 적용', async () => {
      const params = { page: 1, pageSize: 10 };
      const mockList = { list: [], totalCount: 0 };
      (productsRepository.getProductListWithFavorites as jest.Mock).mockResolvedValue(mockList);

      const result = await getProductList(params);

      expect(productsRepository.getProductListWithFavorites).toHaveBeenCalledWith(params, {
        userId: undefined,
      });
      expect(result).toEqual(mockList);
    });
  });

  // ---------------------------------------------------------
  // 3. UPDATE
  // ---------------------------------------------------------
  describe('updateProduct', () => {
    const existingProduct = {
      id: 1,
      name: 'Old Name',
      price: 10000,
      userId: 1,
      description: 'desc',
      tags: [],
      images: [],
    };

    test('상품 수정 : 가격 변동 없음', async () => {
      // [Given]
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(existingProduct);

      (productsRepository.updateProductWithFavorites as jest.Mock).mockResolvedValue({
        ...existingProduct,
        name: 'New Name',
      });

      (favoriteRepository.getFavoriteMember as jest.Mock).mockResolvedValue([]); // 좋아요 누른 사람 없음

      const result = await updateProduct(1, { userId: 1, name: 'New Name' });

      expect(productsRepository.updateProductWithFavorites).toHaveBeenCalled();
      expect(result.name).toBe('New Name');

      // 가격이 안 바뀌었으므로 알림은 발송되지 않아야 함
      expect(notificationRepository.createNotification).not.toHaveBeenCalled();
    });

    test('상품 수정 : 가격 변동, "좋아요"를 누른 유저에게 알림 발송', async () => {
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(existingProduct);
      (productsRepository.updateProductWithFavorites as jest.Mock).mockResolvedValue({
        ...existingProduct,
        price: 5000,
      });

      // 좋아요 누른 유저 2명 가정
      const likeMembers = [{ id: 2 }, { id: 3 }];
      (favoriteRepository.getFavoriteMember as jest.Mock).mockResolvedValue(likeMembers);

      // 가격을 10000 -> 5000으로 변경
      await updateProduct(1, { userId: 1, price: 5000 });

      // 1. DB 알림 생성 함수가 유저 수만큼 호출되었는지 확인
      expect(notificationRepository.createNotification).toHaveBeenCalledTimes(2);

      // 2. 소켓 알림 함수가 유저 수만큼 호출되었는지 확인
      expect(websocket.notifyToUser).toHaveBeenCalledTimes(2);
    });

    test('상품 수정 에러 : 잘못된 상품 id', async () => {
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(null);
      await expect(updateProduct(999, { userId: 1 })).rejects.toThrow(NotFoundError);
    });

    test('상품 수정 에러 : 권한이 없는 사용자', async () => {
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(existingProduct);
      await expect(updateProduct(1, { userId: 2 })).rejects.toThrow(ForbiddenError);
    });
  });

  // ---------------------------------------------------------
  // 4. DELETE
  // ---------------------------------------------------------
  describe('deleteProduct', () => {
    test('상품 삭제', async () => {
      const mockProduct = { id: 1, userId: 1 };
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(mockProduct);
      (productsRepository.deleteProduct as jest.Mock).mockResolvedValue(undefined);

      await deleteProduct(1, 1);
      expect(productsRepository.deleteProduct).toHaveBeenCalledWith(1);
    });

    test('상품 삭제 에러 : 잘못된 상품 id', async () => {
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(null);
      await expect(deleteProduct(999, 1)).rejects.toThrow(NotFoundError);
    });

    test('상품 삭제 에러 : 권한이 없는 사용자', async () => {
      const mockProduct = { id: 1, userId: 1 };
      (productsRepository.getProduct as jest.Mock).mockResolvedValue(mockProduct);
      await expect(deleteProduct(1, 2)).rejects.toThrow(ForbiddenError);
    });
  });
});
