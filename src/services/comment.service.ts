import { CommentRepository } from '../repositories/comment.repository';
import { ProductRepository } from '../repositories/product.repository';
import { ArticleRepository } from '../repositories/article.repository';
import { CreateCommentDto, UpdateCommentDto, CommentResponseDto } from '../dtos/comment.dto';
import { CursorPaginatedResponse } from '../types';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export class CommentService {
  private commentRepository: CommentRepository;
  private productRepository: ProductRepository;
  private articleRepository: ArticleRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
    this.productRepository = new ProductRepository();
    this.articleRepository = new ArticleRepository();
  }

  // Product Comments
  async createProductComment(
    userId: number,
    productId: number,
    data: CreateCommentDto
  ): Promise<CommentResponseDto> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    const comment = await this.commentRepository.createProductComment(userId, productId, data);
    return comment;
  }

  async getProductComments(
    productId: number,
    cursor?: number,
    limit: number = 10
  ): Promise<CursorPaginatedResponse<CommentResponseDto>> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError('상품을 찾을 수 없습니다.');
    }

    const comments = await this.commentRepository.findProductComments(productId, cursor, limit);
    const nextCursor = comments.length === limit ? comments[comments.length - 1].id : null;

    return {
      data: comments,
      nextCursor,
    };
  }

  // ← 이 메서드가 있어야 함!
  async updateProductComment(
    id: number,
    userId: number,
    data: UpdateCommentDto
  ): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.findProductCommentById(id);
    if (!comment) {
      throw new NotFoundError('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenError('댓글을 수정할 권한이 없습니다.');
    }

    const updatedComment = await this.commentRepository.updateProductComment(id, data);
    return updatedComment;
  }

  async deleteProductComment(id: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findProductCommentById(id);
    if (!comment) {
      throw new NotFoundError('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenError('댓글을 삭제할 권한이 없습니다.');
    }

    await this.commentRepository.deleteProductComment(id);
  }

  // Article Comments
  async createArticleComment(
    userId: number,
    articleId: number,
    data: CreateCommentDto
  ): Promise<CommentResponseDto> {
    const article = await this.articleRepository.findById(articleId);
    if (!article) {
      throw new NotFoundError('게시글을 찾을 수 없습니다.');
    }

    const comment = await this.commentRepository.createArticleComment(userId, articleId, data);
    return comment;
  }

  async getArticleComments(
    articleId: number,
    cursor?: number,
    limit: number = 10
  ): Promise<CursorPaginatedResponse<CommentResponseDto>> {
    const article = await this.articleRepository.findById(articleId);
    if (!article) {
      throw new NotFoundError('게시글을 찾을 수 없습니다.');
    }

    const comments = await this.commentRepository.findArticleComments(articleId, cursor, limit);
    const nextCursor = comments.length === limit ? comments[comments.length - 1].id : null;

    return {
      data: comments,
      nextCursor,
    };
  }

  async updateArticleComment(
    id: number,
    userId: number,
    data: UpdateCommentDto
  ): Promise<CommentResponseDto> {
    const comment = await this.commentRepository.findArticleCommentById(id);
    if (!comment) {
      throw new NotFoundError('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenError('댓글을 수정할 권한이 없습니다.');
    }

    const updatedComment = await this.commentRepository.updateArticleComment(id, data);
    return updatedComment;
  }

  async deleteArticleComment(id: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findArticleCommentById(id);
    if (!comment) {
      throw new NotFoundError('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenError('댓글을 삭제할 권한이 없습니다.');
    }

    await this.commentRepository.deleteArticleComment(id);
  }
}
