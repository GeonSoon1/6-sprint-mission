import type { Prisma, PrismaClient, Product } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { TYPES } from '@types';

@injectable()
export class ProductRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  /**
   * 상품 등록
   */
  async createProduct(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data });
  }

  /**
   * 상품 찾기
   */
  async findProducts(options: Prisma.ProductFindManyArgs) {
    return this.prisma.product.findMany(options);
  }

  /**
   * 상품 ID로 찾기
   */
  async findProductById(id: Product['id']) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  /**
   * 상품정보수정
   */
  async updateProduct(id: Product['id'], data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({ where: { id }, data });
  }

  /**
   * 상품삭제
   */
  async deleteProduct(id: Product['id']) {
    return this.prisma.product.delete({ where: { id } });
  }

  /**
   * 상품을 좋아요(favorite)한 유저 ID 목록 조회
   */
  async findFavoriteUserIds(productId: Product['id']) {
    const favorites = await this.prisma.favorite.findMany({
      where: { productId },
      select: { userId: true },
    });
    return favorites.map((f) => f.userId);
  }
}
