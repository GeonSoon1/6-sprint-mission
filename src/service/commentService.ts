import commentRepository from '../repository/commentRepository';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import notificationService from './notificationService';
import { notifyUser } from '../socket/socketServer';

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

  async createArticleComment(articleId: number, content: string, userId: number) {
    const comment = await commentRepository.createArticleComment(articleId, content, userId);

    try {
      const notice = await notificationService.notifyCommentCreated(comment.id);

      if (notice !== null) {
        notifyUser(notice.userId, 'notification', notice);
      } else {
        console.log('알림이 생성되지 않았습니다 (작성자가 본인인 경우).');
      }
    } catch (err) {
      console.error('알림 생성 중 오류 발생:', err);
    }

    return comment;
  }

  async getArticleComments(articleId: number, cursor?: number, limit = '10') {
    const comments = await commentRepository.findArticleComments(
      articleId,
      cursor,
      parseInt(limit),
    );

    return {
      data: comments,
      nextCursor: comments.length > 0 ? comments[comments.length - 1].id : null,
    };
  }

  createProductComment(productId: number, content: string) {
    return commentRepository.createProductComment(productId, content);
  }

  async getProductComments(productId: number, cursor: number | undefined, limit: number) {
    const comments = await commentRepository.getProductComments(productId, cursor, limit);

    return {
      data: comments,
      nextCursor: comments.length > 0 ? comments[comments.length - 1].id : null,
    };
  }
}

export default new CommentService();
