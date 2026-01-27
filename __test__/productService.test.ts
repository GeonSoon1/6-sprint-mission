import 'reflect-metadata';

jest.mock('../src/lib/inversify.config.ts', () => {
  container: {
  }
});

import { ProductService } from '../src/services/productService';
import { CreateProductDTO } from '../src/dto/product.dto';

const mockProductRepository = {
  createProduct: jest.fn(),
  findProducts: jest.fn(),
  findProductById: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  findFavoriteUserIds: jest.fn(),
};

const mockNotificationRepository = {
  createNotification: jest.fn(),
  findNotification: jest.fn(),
  findNotificationById: jest.fn(),
  countUnreadByUserId: jest.fn(),
  updateNotification: jest.fn(),
};

describe('ProductService Unit Test', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService(
      mockProductRepository as any,
      mockNotificationRepository as any,
    );
    jest.clearAllMocks();
  });

  test('createProduct - 상품을 성공적으로 생성해야 한다', async () => {
    // Given(준비)
    const dto: CreateProductDTO = {
      name: '단위 테스트 상품',
      description: '설명',
      price: 10000,
      stock: 4,
      category: 'FASHION',
      status: 'ON_SALE' as any,
      tags: [],
      images: [],
    };

    const userId = 'testUser-123';
    // Mock 설정: repository.create가 호출되면 이 값을 리턴한다
    const expectedResult = {
      id: 'new-id',
      ...dto,
      createAt: new Date(),
      updatedAt: new Date(),
      authorId: userId,
      likeCount: 0,
    };

    mockProductRepository.createProduct.mockResolvedValue(expectedResult);
    // When(실행)
    const result = await productService.createProduct(userId, dto);

    // Then(검증)
    expect(result).toEqual(expectedResult);
    expect(mockProductRepository.createProduct).toHaveBeenCalledTimes(1);
    // expect(mockProductRepository.createProduct).toHaveBeenCalledWith(userId, dto);
    expect(mockProductRepository.createProduct).toHaveBeenCalledWith(
      expect.objectContaining({
        name: dto.name,
        price: dto.price,
        author: { connect: { id: userId } },
      }),
    );
  });
});
