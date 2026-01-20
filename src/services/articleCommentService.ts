import { Article, ArticleComment, User, Prisma } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { ArticleCommentRepository, ArticleRepository } from '@repositories';
import { TYPES } from '@types';
import { NotFoundError, UnauthorizedError } from '@lib';
import { NotificationService } from '@services';

@injectable()
export class ArticleCommentService {
  constructor(
    @inject(TYPES.ArticleCommentRepository)
    private articleCommentRepository: ArticleCommentRepository,
    @inject(TYPES.ArticleRepository) private articleRepository: ArticleRepository,
    @inject(TYPES.NotificationService) private notificationService: NotificationService,
  ) {}

  /**
   * 댓글 작성
   */
  async createComment(articleId: Article['id'], authorId: User['id'], content: string) {
    const article = await this.articleRepository.findArticleById(articleId);
    if (!article) {
      throw new NotFoundError('게시글을 찾을 수 없습니다.');
    }
    // 댓글 생성
    const comment = await this.articleCommentRepository.create({
      article: { connect: { id: articleId } },
      author: { connect: { id: authorId } },
      content,
    });

    // 알림 발송
    if (article.authorId !== authorId) {
      await this.notificationService.createNotification(article.authorId, {
        title: '새 댓글 알림',
        content: `회원님의 게시글 '${article.title}'에 새 댓글이 달렸습니다.`,
        type: 'NOTICE',
        link: `/articles/${articleId}`,
      });
    }

    return comment;
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
