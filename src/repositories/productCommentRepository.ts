import type { Prisma, PrismaClient, User, Product, ProductComment } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types/di';

@injectable()
export class ProductCommentRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  /**
   * 댓글 작성
   */
  async create(data: Prisma.ProductCommentCreateInput) {
    return this.prisma.productComment.create({ data });
  }

  /**
   * 상품 ID로 댓글 찾기
   */
  async findByProductId(productId: Product['id']) {
    return this.prisma.productComment.findMany({ where: { productId } });
  }

  /**
   * 댓글 ID로 찾기
   */
  async findById(id: ProductComment['id']) {
    return this.prisma.productComment.findUnique({ where: { id } });
  }

  /**
   * 사용자 ID로 댓글 찾기
   */
  async findByUserId(authorId: User['id']) {
    return this.prisma.productComment.findMany({ where: { authorId } });
  }

  /**
   * 댓글 수정
   */
  async update(id: ProductComment['id'], data: Prisma.ProductCommentUpdateInput) {
    return this.prisma.productComment.update({ where: { id }, data });
  }

  /**
   * 댓글 삭제
   */
  async delete(id: ProductComment['id']) {
    return this.prisma.productComment.delete({ where: { id } });
  }
}
