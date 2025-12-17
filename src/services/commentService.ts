import { Comment } from '@prisma/client';
import {
  CommentCreateDto,
  CommentQueryDto,
  CommentUpdateDto,
} from '../dto/commentDto';
import { CommentRepository } from '../repogitories/commentRepogitory';

type GetCommentData = Omit<
  Comment,
  'updatedAt' | 'productId' | 'articleId' | 'userId'
>;

export class CommentService {
  constructor(private repo: CommentRepository) {}

  async create(dto: CommentCreateDto): Promise<Comment> {
    return this.repo.create(dto);
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
