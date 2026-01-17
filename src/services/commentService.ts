import { Comment } from '@prisma/client';
import {
  CommentCreateDto,
  CommentQueryDto,
  CommentUpdateDto,
} from '../dto/commentDto';
import { CommentRepository } from '../repogitories/commentRepogitory';
import { ArticleRepogitory } from '../repogitories/articleRepogitory';
import { NotificationService } from './notificationService';

type GetCommentData = Omit<
  Comment,
  'updatedAt' | 'productId' | 'articleId' | 'userId'
>;

export class CommentService {
  constructor(private repo: CommentRepository,
    private articleRepo: ArticleRepogitory,
    private notificationService: NotificationService,
  ) {}

  async create(dto: CommentCreateDto): Promise<Comment> {
    const comment = await this.repo.create(dto);
    // 게시글 댓글인 경우 알림 발송
    if (dto.articleId) {
      const authorId = await this.articleRepo.findUserId(dto.articleId);
      // 작성자가 존재하고, 본인이 쓴 댓글이 아닐 경우에만 알림
      if (authorId && authorId !== dto.userId) {
        const message = '내가 판매 신청한 매물에 새로운 댓글이 달렸습니다.';
        await this.notificationService.create(authorId, message);
      }
    }
    return comment;
  }

  async getCommentsByProduct(dto: CommentQueryDto): Promise<GetCommentData[]> {
    return this.repo.findManyComment(dto);
  }

  async getCommentsByArticle(dto: CommentQueryDto): Promise<GetCommentData[]> {
    return this.repo.findManyComment(dto);
  }

  async update(id: string, dto: CommentUpdateDto): Promise<Comment> {
    return this.repo.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
