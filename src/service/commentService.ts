import { User } from '@prisma/client';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizeError from '../lib/errors/UnauthorizeError';
import { articleRepository } from '../repository/articleRepository';
import { commentRepository } from '../repository/commentRepository';
import { productRepository } from '../repository/productRepository';
import { UpdateCommentDto } from '../dto/comment.dto';

export const commentService = {
  async createArticleComment(content: string, user: User | null | undefined, articleId: number) {
    if (!user) {
      throw new UnauthorizeError();
    }

    const existingArticle = await articleRepository.findById(articleId);

    if (!existingArticle) {
      throw new NotFoundError('article', articleId);
    }

    return commentRepository.createComment({ articleId, content: content, authorId: user.id });
  },

  async getArticleCommentList(articleId: number, cursor: number | null, limit: number) {
    const article = await articleRepository.findById(articleId);
    if (!article) {
      throw new NotFoundError('article', articleId);
    }

    const commentsWithCursor = await commentRepository.getCommentList({
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1,
      where: { articleId },
      orderBy: { createdAt: 'desc' },
    });
    const comments = commentsWithCursor.slice(0, limit);
    const lastComment = comments[comments.length - 1];

    return {
      list: comments,
      nextCursor: lastComment ? lastComment.id : null,
    };
  },

  async createProductComment(content: string, user: User | null | undefined, productId: number) {
    if (!user) {
      throw new UnauthorizeError();
    }

    const existingProduct = await productRepository.findById(productId);

    if (!existingProduct) {
      throw new NotFoundError('article', productId);
    }

    return commentRepository.createComment({ productId, content: content, authorId: user.id });
  },

  async getProductCommentList(productId: number, cursor: number | null, limit: number) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError('product', productId);
    }

    const commentsWithCursor = await commentRepository.getCommentList({
      cursor: cursor ? { id: cursor } : undefined,
      take: limit + 1,
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
    const comments = commentsWithCursor.slice(0, limit);
    const lastComment = comments[comments.length - 1];

    return {
      list: comments,
      nextCursor: lastComment ? lastComment.id : null,
    };
  },

  async updateComment(id: number, user: User | null | undefined, content: UpdateCommentDto) {
    const existingComment = await commentRepository.findComment(id);

    if (!existingComment) {
      throw new NotFoundError('comment', id);
    }

    if (!user) {
      throw new UnauthorizeError();
    }

    if (existingComment.authorId !== user.id) {
      throw new ForbiddenError('comment');
    }

    return commentRepository.updateComment(id, content);
  },

  async deleteComment(id: number, user: User | null | undefined) {
    const existingComment = await commentRepository.findComment(id);

    if (!existingComment) {
      throw new NotFoundError('comment', id);
    }

    if (!user) {
      throw new UnauthorizeError();
    }

    if (existingComment.authorId !== user.id) {
      throw new ForbiddenError('comment');
    }

    return commentRepository.deleteComment(id);
  },
};
