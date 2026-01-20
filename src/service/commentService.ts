import commentRepository from '../repository/commentRepository';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';

class CommentService {
  //댓글 수정
  async updateComment(id: number, content: string, loginUserId: number) {
    const existingComment = await commentRepository.findById(id);

    if (!existingComment) {
      throw new NotFoundError('댓글이 존재하지 않습니다.');
    }
    if (existingComment.userId !== loginUserId) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    return commentRepository.updateComment(id, content);
  }
  //댓글 삭제
  async deleteComment(id: number, loginUserId: number) {
    const existingComment = await commentRepository.findById(id);

    if (!existingComment) {
      throw new NotFoundError('댓글이 존재하지 않습니다.');
    }

    if (existingComment.userId !== loginUserId) {
      throw new ForbiddenError('본인만 접근할 수 있습니다.');
    }

    return commentRepository.deleteComment(id);
  }
}

export default new CommentService();
