import { articleRepository } from '../repositories/articleRepository.js';
import { commentRepository } from '../repositories/commentRepository.js';
import { likeRepository } from '../repositories/likeRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
export class ArticleService {
    async createArticle(userId, data) {
        return articleRepository.create({ ...data, userId });
    }
    async getArticle(id, userId) {
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
    async updateArticle(id, userId, data) {
        const existingArticle = await articleRepository.findById(id);
        if (!existingArticle) {
            throw new NotFoundError('article', id);
        }
        if (existingArticle.userId !== userId) {
            throw new ForbiddenError('Should be the owner of the article');
        }
        return articleRepository.update(id, data);
    }
    async deleteArticle(id, userId) {
        const existingArticle = await articleRepository.findById(id);
        if (!existingArticle) {
            throw new NotFoundError('article', id);
        }
        if (existingArticle.userId !== userId) {
            throw new ForbiddenError('Should be the owner of the article');
        }
        await articleRepository.delete(id);
    }
    async getArticleList(query, userId) {
        const totalCount = await articleRepository.count(query);
        const articles = await articleRepository.findMany(query);
        const articlesWithLikes = articles.map((article) => {
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
    async createComment(articleId, userId, data) {
        const existingArticle = await articleRepository.findById(articleId);
        if (!existingArticle) {
            throw new NotFoundError('article', articleId);
        }
        return commentRepository.create({ ...data, userId, articleId });
    }
    async getCommentList(articleId, query) {
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
    async createLike(articleId, userId) {
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
    async deleteLike(articleId, userId) {
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
//# sourceMappingURL=articleService.js.map