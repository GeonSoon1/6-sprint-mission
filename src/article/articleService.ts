import { Prisma } from '@prisma/client';
import articleLikeRepository from '../article/articleLikeRepository';
import articleRepository from '../article/articleRepository';
import { ArticleFindOptions, ArticlePublicData, UpdateArticleData } from './../libs/interfaces';
import { CustomError } from '../libs/Handler/errorHandler';

class ArticleService {
    async likeArticle(userId: number, articleId: number) {
        const existingLike = await articleLikeRepository.find(userId, articleId);

        if (existingLike) {
            await articleLikeRepository.remove(existingLike.id);
            return { liked: false };
        }

        await articleLikeRepository.create(userId, articleId);
        return { liked: true };
    }

    async getArticleById(articleId: number, userId: number) {
        const article = await articleRepository.findById(articleId, userId);
        const { articleLikes, ...rest } = article;
        return { ...rest, isLiked: articleLikes.length > 0 };
    }

    async getArticles(findOptions: ArticleFindOptions, userId: number) {
        const articles = await articleRepository.findAll(findOptions, userId);
        return articles.map((article) => {
            const { articleLikes, ...rest } = article;
            return { ...rest, isLiked: articleLikes.length > 0 };
        });
    }
    async postArticle(userFields: ArticlePublicData) {
        return await articleRepository.create(userFields);
    }
    async patchArticleById(id: number, userFields: UpdateArticleData) {
        const article = await articleRepository.findById(id);
        if (article.userId !== userFields.userId) {
            throw new CustomError(403, "권한이 없습니다.");
        }
        return await articleRepository.update(id, userFields);
    }
    async deleteArticleById(id: number, userId: number) {
        const article = await articleRepository.findById(id);
        if (article.userId !== userId) {
            throw new CustomError(403, "권한이 없습니다.");
        }

        return await articleRepository.ondelete(id);
    }
}

export const articleService = new ArticleService();
