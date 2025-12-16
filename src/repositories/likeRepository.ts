import { PrismaClient, Product, Article, User } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types/di';

@injectable()
export class LikeRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  /**
   * 상품 좋아요 찾기
   */
  async findProductLike(userId: User['id'], productId: Product['id']) {
    return this.prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    });
  }

  /**
   * 상품 좋아요 생성
   */
  async createProductLike(userId: User['id'], productId: Product['id']) {
    return this.prisma.$transaction([
      this.prisma.favorite.create({ data: { userId, productId } }),
      this.prisma.product.update({
        where: { id: productId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);
  }

  /**
   * 상품 좋아요 삭제
   */
  async deleteProductLike(userId: User['id'], productId: Product['id']) {
    return this.prisma.$transaction([
      this.prisma.favorite.delete({
        where: { userId_productId: { userId, productId } },
      }),
      this.prisma.product.update({
        where: { id: productId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
  }

  /**
   * 게시글 좋아요 찾기
   */
  async findArticleLike(userId: User['id'], articleId: Article['id']) {
    return this.prisma.like.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
  }

  // 게시글 좋아요 생성
  async createArticleLike(userId: User['id'], articleId: Article['id']) {
    return this.prisma.$transaction([
      this.prisma.like.create({ data: { userId, articleId } }),
      this.prisma.article.update({
        where: { id: articleId },
        data: { likeCount: { increment: 1 } },
      }),
    ]);
  }

  // 게시글 좋아요 삭제
  async deleteArticleLike(userId: User['id'], articleId: Article['id']) {
    return this.prisma.$transaction([
      this.prisma.like.delete({
        where: { userId_articleId: { userId, articleId } },
      }),
      this.prisma.article.update({
        where: { id: articleId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
  }
}
