import { Prisma, User, Product, NotificationType } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { ProductRepository } from '@repositories';
import type { CreateProductDTO } from '@dto';
import { TYPES } from '@types';
import { NotFoundError, ForbiddenError } from '@lib';
import { NotificationService } from '@services';

@injectable()
export class ProductService {
  // 생성자(constructor)에서 ProductRepository의 인스턴스 주입 받음
  constructor(
    @inject(TYPES.ProductRepository)
    private productRepository: ProductRepository,
    @inject(TYPES.NotificationService)
    private notificationService: NotificationService,
  ) {}

  /**
   * 상품 등록
   * @param id 상품을 등록하는 사용자의 ID
   * @param productData 등록할 상품의 데이터
   */
  async createProduct(id: User['id'], productData: CreateProductDTO) {
    const { name, description, category, price, stock, status, tags, images } = productData;

    const dataToCreate: Prisma.ProductCreateInput = {
      name,
      description,
      category,
      price,
      stock,
      status,
      author: { connect: { id } },
      images: images ? { create: images.map((url) => ({ url })) } : undefined,
      tags: tags
        ? {
            connectOrCreate: tags.map((tagName) => ({
              where: { tag: tagName },
              create: { tag: tagName },
            })),
          }
        : undefined,
    };
    const newProduct = await this.productRepository.createProduct(dataToCreate);
    return newProduct;
  }

  /**
   * 상품 목록 조회
   * @param options Prisma.ProductFindManyArgs 타입의 옵션 객체
   */
  async findProducts(options: Prisma.ProductFindManyArgs) {
    // Service에서는 별도의 비즈니스 로직 없이 Repository 호출
    return this.productRepository.findProducts(options);
  }

  /**
   * 상품 상세 조회
   * @param id 조회할 상품의 ID
   */
  async findProductById(id: Product['id']) {
    const product = await this.productRepository.findProductById(id);
    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }
    return product;
  }

  /**
   * 상품 정보 수정
   * @param productId 수정할 상품의 ID
   * @param userId 수정을 시도하는 사용자의 ID
   * @param data 수정할 상품의 데이터
   */
  async updateProduct(
    productId: Product['id'],
    userId: User['id'],
    data: Prisma.ProductUpdateInput,
  ) {
    // 권한 확인
    const product = await this.checkProductOwnership(productId, userId);
    const oldPrice = product.price;
    const newPrice = data.price;

    const updatedProduct = await this.productRepository.updateProduct(productId, data);

    const isPriceChanged = typeof newPrice === 'number' && oldPrice !== newPrice;

    // 정보 업데이트
    if (isPriceChanged) {
      const userIds = await this.productRepository.findFavoriteUserIds(productId);

      await this.notificationService.createNotification(userIds, {
        title: '관심상품 가격변동',
        content: `찜하신 상품의 가격이 변경되었습니다.`,
        type: NotificationType.NOTICE,
        link: `/product/${productId}`,
      });
    }
    return updatedProduct;
  }

  /**
   * 상품 삭제
   * @param productId 삭제할 상품의 ID
   * @param userId 삭제를 시도하는 사용자의 ID
   */
  async deleteProduct(productId: Product['id'], userId: User['id']) {
    await this.checkProductOwnership(productId, userId);
    return this.productRepository.deleteProduct(productId);
  }

  /**
   * 헬퍼 메소드(private)
   */
  private async checkProductOwnership(productId: Product['id'], userId: User['id']) {
    const product = await this.productRepository.findProductById(productId);

    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    if (product.authorId !== userId) {
      throw new ForbiddenError('삭제 권한이 없습니다.');
    }

    return product;
  }
}
