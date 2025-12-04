import { commentsService } from '../services/commentsService';
import { RequestHandler } from 'express';
import { ErrorWithStatus } from '../utils/types';

export const createComment: RequestHandler = async (req, res, next) => {
  const { articleId, productId } = req.params;
  const { content } = req.body;
  const userId = req.user!.id;

  let newComment;
  if (articleId) {
    newComment = await commentsService.createArticleComment(articleId, content, userId);
  } else if (productId) {
    newComment = await commentsService.createProductComment(productId, content, userId);
  } else {
    const err: ErrorWithStatus = new Error('게시글 또는 상품 ID가 필요합니다.');
    err.status = 400;
    throw err;
  }

  res.status(201).send(newComment);
};

export const getComments: RequestHandler = async (req, res, next) => {
  const { articleId, productId } = req.params;
  const { cursor, limit } = req.paginationParams!;

  let result;
  if (articleId) {
    result = await commentsService.findCommentsByArticleId({
      articleId,
      cursor,
      limit,
    });
  } else if (productId) {
    result = await commentsService.findCommentsByProductId({
      productId,
      cursor,
      limit,
    });
  } else {
    const err: ErrorWithStatus = new Error('게시글 또는 상품 ID가 필요합니다.');
    err.status = 400;
    throw err;
  }

  res.status(200).json({
    message: '댓글 목록을 조회했습니다.',
    data: result.comments,
    pagination: {
      nextCursor: result.nextCursor,
    },
  });
};

export const patchComment: RequestHandler = async (req, res, next) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user!.id;

  if (!content) {
    const err: ErrorWithStatus = new Error('수정할 내용이 비어 있습니다.');
    err.status = 400;
    throw err;
  }

  const updatedComment = await commentsService.updateCommentInDb(commentId, content, userId);

  res.status(200).json({
    message: '댓글이 성공적으로 수정되었습니다.',
    data: updatedComment,
  });
};

export const deleteComment: RequestHandler = async (req, res, next) => {
  const { commentId } = req.params;
  const userId = req.user!.id;

  const deletedComment = await commentsService.deleteCommentInDb(commentId, userId);

  res.status(200).json({
    message: '댓글이 성공적으로 삭제되었습니다.',
    data: deletedComment,
  });
};
