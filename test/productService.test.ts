import { productService } from '../src/services/productService';
import productRepository from '../src/repositories/productRepository';

// Repository 모듈 전체를 Mocking
jest.mock('../src/repositories/productRepository');

// Mock 객체에 대한 타입 정의 (타입 안전성 및 자동완성 지원)
const mockProductRepository = productRepository as jest.Mocked<typeof productRepository>;

describe('ProductService Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createProducts', () => {
        it('should create a product successfully', async () => {
            // Arrange
            const productData = {
                name: 'Unit Test Product',
                description: 'Desc',
                price: 1000,
                tags: ['tag'],
                images: [],
                userId: 1
            };
            const mockCreatedProduct = {
                id: 1,
                name: productData.name,
                description: productData.description,
                price: productData.price,
                tags: productData.tags,
                userId: productData.userId,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            // Repository의 create 메소드가 mockCreatedProduct를 반환하도록 설정 (Mock)
            mockProductRepository.create.mockResolvedValue(mockCreatedProduct);

            // Act
            const result = await productService.createProducts(productData);

            // Assert
            expect(mockProductRepository.create).toHaveBeenCalledTimes(1);
            expect(mockProductRepository.create).toHaveBeenCalledWith(productData);
            expect(result).toEqual(mockCreatedProduct);
        });
    });

    describe('getProductById', () => {
        it('should return product with isLiked status', async () => {
            const productId = 1;
            const userId = 1;
            const mockProduct = {
                id: productId,
                name: 'Test',
                description: 'Test Description',
                price: 1000,
                tags: ['tag'],
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                productLikes: [{
                    id: 1,
                    userId: userId,
                    productId: productId,
                    createdAt: new Date()
                }] // 좋아요를 누른 상태 시뮬레이션
            };

            mockProductRepository.findById.mockResolvedValue(mockProduct);

            const result = await productService.getProductById(productId, userId);

            expect(mockProductRepository.findById).toHaveBeenCalledWith(productId, userId);
            // Service 로직에 의해 productLikes 배열은 사라지고 isLiked 속성이 생겨야 함
            expect(result).toHaveProperty('isLiked', true);
            expect(result).toHaveProperty('name', 'Test');
            expect(result).not.toHaveProperty('productLikes');
        });
    });
});