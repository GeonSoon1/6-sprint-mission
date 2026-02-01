import NotFoundError from '../errors/NotFoundError.js'
import BadRequestError from '../errors/BadRequestError.js'
import * as commentRepo from '../repositories/comment.repo.js'
import * as productRepo from '../repositories/product.repo.js'
import * as articleRepo from '../repositories/article.repo.js'
import * as notificationRepo from "../repositories/notification.repo.js";
import { getIO } from "../socket.js";
import ForbiddenError from '../errors/ForbiddenError.js'

export async function createComment(data, user) {
  if (!data.productId && !data.articleId) {
    throw new BadRequestError("productId 또는 articleId 중 하나는 존재해야합니다.");
  }

  if (data.productId && data.articleId) {
    throw new BadRequestError("productId와 articleId를 동시에 입력 할 수 없습니다.");
  }


  if (data.productId) {
    const product = await productRepo.getProductById(data.productId);
    if (!product) {
      throw new NotFoundError("상품을 찾을 수 없습니다.");
    }
  }

  let article = null;
  if (data.articleId) {
    article = await articleRepo.getArticleById(data.articleId);
    if (!article) throw new NotFoundError("게시글을 찾을 수 없습니다.");
  }

  const comment = await commentRepo.createComment({
    content: data.content,
    userId: user.id,
    productId: data.productId ?? null,
    articleId: data.articleId ?? null,
  });

  if (article && article.userId !== user.id) {
    const n = await notificationRepo.createNotification({
      userId: article.userId,
      type: "ARTICLE_COMMENTED",
      title: "게시글에 새 댓글이 달렸어요",
      body: `${article.title}에 댓글이 달렸습니다.`,
      articleId: article.id,
      productId: null,
      isRead: false,
    });

    const io = getIO()
    io.to(`user:${article.userId}`).emit("notification:new", n)
  }

  return comment;
}

export async function getComment(commentId) {
  const comment = await commentRepo.getCommentById(commentId)
  if (!comment) {
    throw new NotFoundError('댓글을 찾을 수 없습니다.')
  }
  return comment
}

export async function updateComment(commentId, data, user) {
  const existingComment = await commentRepo.getCommentById(commentId)
  if (!existingComment) {
    throw new NotFoundError('댓글이 존재하지 않습니다.')    
  }

  if (existingComment.userId !==user.id) {
    throw new ForbiddenError('댓글을 수정 할 권한이 없습니다.')
  }

  const updated = await commentRepo.updateComment(commentId, data)
  return updated
}

export async function deleteComment(commentId, user) {
  const existingComment = await commentRepo.getCommentById(commentId)
  if (!existingComment) {
    throw new NotFoundError('댓글이 존재하지 않습니다.')
  }

  if (existingComment.userId !== user.id) {
    throw new ForbiddenError('댓글을 삭제 할 권한이 없습니다.')
  }

  return await commentRepo.deleteComment(commentId)
}
