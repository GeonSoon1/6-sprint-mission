import {
  CommentCreateDto,
  CommentQueryDto,
  CommentUpdateDto,
} from '../dto/commentDto';
import { CommentRepository } from '../repogitories/commentRepogitory';

export class CommentService {
  constructor(private repo: CommentRepository) {}

  async create(dto: CommentCreateDto) {
    return this.repo.create(dto);
  }

  async getCommentsByProduct(dto: CommentQueryDto) {
    return this.repo.findManyComment(dto);
  }

  async getCommentsByArticle(dto: CommentQueryDto) {
    return this.repo.findManyComment(dto);
  }

  async update(id: string, dto: CommentUpdateDto) {
    return this.repo.update(id, dto);
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}
