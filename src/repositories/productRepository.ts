import type { Prisma, PrismaClient, User } from '@prisma/client';

export class ProductRepository {
  constructor(private prisma: PrismaClient) {}

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
  async findProductById(id: User['id']) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  /**
   * 상품정보수정
   */
  async updateProduct(id: User['id'], data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({ where: { id }, data });
  }

  /**
   * 상품삭제
   */
  async deleteProduct(id: User['id']) {
    return this.prisma.product.delete({ where: { id } });
  }
}
