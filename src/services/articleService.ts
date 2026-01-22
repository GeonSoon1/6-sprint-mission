import { articleRepository } from '../repositories/articleRepository';
import { commentRepository } from '../repositories/commentRepository';
import { likeRepository } from '../repositories/likeRepository';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import BadRequestError from '../lib/errors/BadRequestError';
import {
  CreateArticleDTO,
  UpdateArticleDTO,
  ArticleListQueryDTO,
  ArticleResponseDTO,
  CreateCommentDTO,
  CommentListQueryDTO,
} from '../types/dto';
import { Comment } from '@prisma/client';
import { notificationService } from './notificationService';
import { NOTIFICATION_TYPES } from '../types/notification';

export class ArticleService {
  async createArticle(userId: number, data: CreateArticleDTO) {
    return articleRepository.create({ ...data, userId });
  }

  async getArticle(id: number, userId?: number): Promise<ArticleResponseDTO> {
    const article = await articleRepository.findById(id);
    if (!article) {
      throw new NotFoundError('article', id);
    }

    const { likes, ...articleWithoutLikes } = article;
    return {
      ...articleWithoutLikes,
      likeCount: likes.length,
      isLiked: userId ? likes.some((like) => like.userId === userId) : undefined,
    };
  }

  async updateArticle(id: number, userId: number, data: UpdateArticleDTO) {
    const existingArticle = await articleRepository.findById(id);
    if (!existingArticle) {
      throw new NotFoundError('article', id);
    }

    if (existingArticle.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the article');
    }

    return articleRepository.update(id, data);
  }

  async deleteArticle(id: number, userId: number): Promise<void> {
    const existingArticle = await articleRepository.findById(id);
    if (!existingArticle) {
      throw new NotFoundError('article', id);
    }

    if (existingArticle.userId !== userId) {
      throw new ForbiddenError('Should be the owner of the article');
    }

    await articleRepository.delete(id);
  }

  async getArticleList(query: ArticleListQueryDTO, userId?: number): Promise<{ list: ArticleResponseDTO[]; totalCount: number }> {
    const totalCount = await articleRepository.count(query);
    const articles = await articleRepository.findMany(query);

    const articlesWithLikes: ArticleResponseDTO[] = articles.map((article) => {
      const { likes, ...articleWithoutLikes } = article;
      return {
        ...articleWithoutLikes,
        likeCount: likes.length,
        isLiked: userId ? likes.some((like) => like.userId === userId) : undefined,
      };
    });

    return {
      list: articlesWithLikes,
      totalCount,
    };
  }

  async createComment(articleId: number, userId: number, data: CreateCommentDTO) {
    const existingArticle = await articleRepository.findById(articleId);
    if (!existingArticle) {
      throw new NotFoundError('article', articleId);
    }

    const createdComment = await commentRepository.create({ ...data, userId, articleId });

    if (existingArticle.userId !== userId) {
      await notificationService.createNotification({
        userId: existingArticle.userId,
        type: NOTIFICATION_TYPES.NEW_COMMENT,
        content: `New comment on your article "${existingArticle.title}".`,
        articleId: existingArticle.id,
      });
    }

    return createdComment;
  }

  async getCommentList(articleId: number, query: CommentListQueryDTO): Promise<{ list: Comment[]; nextCursor: number | null }> {
    const article = await articleRepository.findById(articleId);
    if (!article) {
      throw new NotFoundError('article', articleId);
    }

    const commentsWithCursor = await commentRepository.findByArticleId(articleId, query);
    const comments = commentsWithCursor.slice(0, query.limit);
    const cursorComment = commentsWithCursor[comments.length - 1];
    const nextCursor = cursorComment ? cursorComment.id : null;

    return {
      list: comments,
      nextCursor,
    };
  }

  async createLike(articleId: number, userId: number): Promise<void> {
    const existingArticle = await articleRepository.findById(articleId);
    if (!existingArticle) {
      throw new NotFoundError('article', articleId);
    }

    const existingLike = await likeRepository.findByArticleIdAndUserId(articleId, userId);
    if (existingLike) {
      throw new BadRequestError('Already liked');
    }

    await likeRepository.create({ articleId, userId });
  }

  async deleteLike(articleId: number, userId: number): Promise<void> {
    const existingArticle = await articleRepository.findById(articleId);
    if (!existingArticle) {
      throw new NotFoundError('article', articleId);
    }

    const existingLike = await likeRepository.findByArticleIdAndUserId(articleId, userId);
    if (!existingLike) {
      throw new BadRequestError('Not liked');
    }

    await likeRepository.delete(existingLike.id);
  }
}

export const articleService = new ArticleService();

