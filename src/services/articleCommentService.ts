import { Article, ArticleComment, User, Prisma } from '@prisma/client';
import { ArticleCommentRepository } from '../repositories';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types/di';
import { NotFoundError, UnauthorizedError } from '../lib/errors';

@injectable()
export class ArticleCommentService {
  constructor(
    @inject(TYPES.ArticleCommentRepository)
    private articleCommentRepository: ArticleCommentRepository,
  ) {}

  /**
   * 댓글 작성
   */
  async createComment(articleId: Article['id'], authorId: User['id'], content: string) {
    const data: Prisma.ArticleCommentCreateInput = {
      article: { connect: { id: articleId } },
      author: { connect: { id: authorId } },
      content,
    };
    return this.articleCommentRepository.create(data);
  }

  /**
   * 게시물 ID로 댓글 찾기
   */
  async getComments(articleId: Article['id']) {
    return this.articleCommentRepository.findByArticleId(articleId);
  }

  /**
   * 댓글 수정
   */
  async updateComment(
    commentId: ArticleComment['id'],
    authorId: User['id'],
    data: Prisma.ArticleCommentUpdateInput,
  ) {
    await this.checkCommentOwner(commentId, authorId);
    return this.articleCommentRepository.update(commentId, data);
  }

  /**
   * 댓글 삭제
   */
  async deleteComment(commentId: ArticleComment['id'], authorId: User['id']) {
    await this.checkCommentOwner(commentId, authorId);
    return this.articleCommentRepository.delete(commentId);
  }

  /**
   * 헬퍼 메소드
   */
  async checkCommentOwner(commentId: ArticleComment['id'], authorId: User['id']) {
    const comment = await this.articleCommentRepository.findById(commentId);

    if (!comment) {
      throw new NotFoundError('댓글을 찾을 수 없습니다.');
    }

    if (comment.authorId !== authorId) {
      throw new UnauthorizedError('수정 및 삭제할 권한이 없습니다.');
    }
  }
}
