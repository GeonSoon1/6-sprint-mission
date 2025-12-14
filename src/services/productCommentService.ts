import { ProductCommentRepository } from '../repositories/productCommentRepository';
import { Prisma, Product, User, ProductComment } from '@prisma/client';

export class ProductCommentService {
  constructor(private productCommentRepository: ProductCommentRepository) {}

  /**
   * 댓글 작성
   */
  async createComment(
    productId: Product['id'],
    authorId: User['id'],
    content: string,
  ) {
    const data: Prisma.ProductCommentCreateInput = {
      product: { connect: { id: productId } },
      author: { connect: { id: authorId } },
      content,
    };
    return this.productCommentRepository.create(data);
  }

  /**
   * 상품 ID로 댓글 찾기
   */
  async getComments(productId: Product['id']) {
    return this.productCommentRepository.findByProductId(productId);
  }

  /**
   * 댓글 수정
   */
  async updateComment(
    commentId: ProductComment['id'],
    authorId: User['id'],
    data: Prisma.ProductCommentUpdateInput,
  ) {
    await this.checkCommentOwner(commentId, authorId);
    return this.productCommentRepository.update(commentId, data);
  }

  /**
   * 댓글 삭제
   */
  async deleteComment(commentId: ProductComment['id'], authorId: User['id']) {
    await this.checkCommentOwner(commentId, authorId);
    return this.productCommentRepository.delete(commentId);
  }

  // 헬퍼 메소드
  async checkCommentOwner(
    commentId: ProductComment['id'],
    authorId: User['id'],
  ) {
    const comment = await this.productCommentRepository.findById(commentId);

    if (!comment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }

    if (comment.authorId !== authorId) {
      throw new Error('수정 및 삭제할 권한이 없습니다.');
    }
  }
}
