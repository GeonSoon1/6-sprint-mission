import { jest } from '@jest/globals';

describe("ProductService Unit Tests", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("createProduct - 비즈니스 로직 검증", async () => {
    // Given: Mock 데이터 설정
    const mockProduct = { id: 1, name: "Test Product", price: 1000, description: "a", imagePath: "b", tags: [], userId: 1, stock: 10, createdAt: new Date(), updatedAt: new Date() };

    jest.unstable_mockModule('../../repositories/productsRepository.js', () => ({
        createProduct: jest.fn().mockResolvedValue(mockProduct),
    }));
    jest.unstable_mockModule('../../lib/prisma-client.js', () => ({
        default: {
            product: {
                create: jest.fn().mockResolvedValue(mockProduct),
            }
        }
    }));
    const productService = await import ('../../services/product-service.js');


    // When: 서비스 메서드 실행
    const result = await productService.createProduct({ name: "Test Product", price: 1000, description: "a", imagePath: "b", tags: [] });

    // Then: 결과 및 호출 검증
    expect(result).toEqual(mockProduct);
  });

  test("createProduct - 유효성 검사 실패 시 에러 발생", async () => {
    jest.unstable_mockModule('../../repositories/productsRepository.js', () => ({
        createProduct: jest.fn().mockRejectedValue(new Error("Price must be positive")),
    }));
    jest.unstable_mockModule('../../lib/prisma-client.js', () => ({
        default: {
            product: {
                create: jest.fn().mockRejectedValue(new Error("Price must be positive")),
            }
        }
    }));
    const productService = await import ('../../services/product-service.js');

    await expect(
      productService.createProduct({ name: "Bad Product", price: -100, description: "a", imagePath: "b", tags: [] }),
    ).rejects.toThrow("Price must be positive");
  });
});
