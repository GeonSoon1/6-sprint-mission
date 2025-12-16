import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from '../dtos/product.dto';
import { PaginatedResponse } from '../types';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(userId: number, data: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepository.create(userId, data);
    return product;
  }

  async getProduct(id: number, userId?: number): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    let isLiked = false;
    if (userId) {
      const like = await this.productRepository.findLike(userId, id);
      isLiked = !!like;
    }

    return {
      ...product,
      isLiked,
      likeCount: product._count?.likes ?? 0,  // ← 수정
    };
  }

  async getProducts(
    page: number = 1,
    limit: number = 10,
    keyword?: string,
    orderBy?: string
  ): Promise<PaginatedResponse<any>> {
    const skip = (page - 1) * limit;
    const { products, total } = await this.productRepository.findMany({
      skip,
      take: limit,
      keyword,
      orderBy: orderBy as 'recent' | undefined,
    });

    return {
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  async updateProduct(
    id: number,
    userId: number,
    data: UpdateProductDto
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    if (product.userId !== userId) {
      throw new ForbiddenError('상품을 수정할 권한이 없습니다.');
    }

    const updatedProduct = await this.productRepository.update(id, data);
    return updatedProduct;
  }

  async deleteProduct(id: number, userId: number): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    if (product.userId !== userId) {
      throw new ForbiddenError('상품을 삭제할 권한이 없습니다.');
    }

    await this.productRepository.delete(id);
  }

  async getUserProducts(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<any>> {
    const skip = (page - 1) * limit;
    const { products, total } = await this.productRepository.findByUserId(userId, skip, limit);

    const productsWithLikeCount = products.map((product) => ({
      ...product,
      likeCount: product._count?.likes ?? 0,  // ← 수정
    }));

    return {
      data: productsWithLikeCount,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  async toggleLike(userId: number, productId: number): Promise<{ isLiked: boolean }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    const existingLike = await this.productRepository.findLike(userId, productId);

    if (existingLike) {
      await this.productRepository.deleteLike(userId, productId);
      return { isLiked: false };
    } else {
      await this.productRepository.createLike(userId, productId);
      return { isLiked: true };
    }
  }

  async getLikedProducts(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<any>> {
    const skip = (page - 1) * limit;
    const { likes, total } = await this.productRepository.findLikedProducts(userId, skip, limit);

    const products = likes.map((like) => ({
      ...like.product,
      isLiked: true,
      likeCount: like.product._count?.likes ?? 0,  // ← 수정
    }));

    return {
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }
}
