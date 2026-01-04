import { LikeRepository } from '../repositories/likeRepository';
import { ProductRepository } from '../repositories/productRepository';
import { ArticleRepository } from '../repositories/articleRepository';
import type { Product, Article, User } from '@prisma/client';

export class LikeService {
  constructor(
    private likeRepository: LikeRepository,
    private productRepository: ProductRepository,
    private articleRepository: ArticleRepository,
  ) {}

  async toggleProductLike(userId: User['id'], productId: Product['id']) {
    // 상품 존재 여부 확인
    const product = await this.productRepository.findProductById(productId);
    if (!product) {
      throw new Error('상품을 찾을 수 없습니다.');
    }

    // 사용자가 이미 해당 상품에 '좋아요'를 눌렀는지 확인
    const existingLike = await this.likeRepository.findProductLike(
      userId,
      productId,
    );

    // 토글 로직 수행
    if (existingLike) {
      // '좋아요'가 이미 존자하면 삭제 트랜잭션 실행
      const [, updatedProduct] = await this.likeRepository.deleteProductLike(
        userId,
        productId,
      );
      // 클라이언트에게 현재 '좋아요'상태 전달
      return { liked: false, likeCount: updatedProduct.likeCount };
    } else {
      // '좋아요'가 없으면 생성 트랜잭션 실행
      const [, updatedProduct] = await this.likeRepository.createProductLike(
        userId,
        productId,
      );
      // 클라이언트에게 현재 '좋아요'상태 전달
      return { liked: true, likeCount: updatedProduct.likeCount };
    }
  }

  async toggleArticleLike(userId: User['id'], articleId: Article['id']) {
    const article = await this.articleRepository.findArticleById(articleId);
    if (!article) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }
    const existingLike = await this.likeRepository.findArticleLike(
      userId,
      articleId,
    );
    if (existingLike) {
      const [, updatedArticle] = await this.likeRepository.deleteArticleLike(
        userId,
        articleId,
      );
      return { liked: false, likeCount: updatedArticle.likeCount };
    } else {
      const [, updatedArticle] = await this.likeRepository.createArticleLike(
        userId,
        articleId,
      );
      return { liked: true, likeCount: updatedArticle.likeCount };
    }
  }
}
