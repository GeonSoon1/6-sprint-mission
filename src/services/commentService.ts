import { commentRepository } from '../repositories/commentRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import { UpdateCommentDTO } from '../types/dto.js';

export class CommentService {
  async updateComment(id: number, userId: number, data: UpdateCommentDTO) {
    const existingComment = await commentRepository.findById(id);
    if (!existingComment) {
      throw new NotFoundError('comment', id);
    }

    if (existingComment.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the comment');
    }

    return commentRepository.update(id, data);
  }

  async deleteComment(id: number, userId: number): Promise<void> {
    const existingComment = await commentRepository.findById(id);
    if (!existingComment) {
      throw new NotFoundError('comment', id);
    }

    if (existingComment.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the comment');
    }

    await commentRepository.delete(id);
  }
}

export const commentService = new CommentService();

